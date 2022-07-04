const express = require('express')
// const proxy = require('express-http-proxy')
const next = require('next')
const { default: pino } = require('pino')
const { parse } = require('url')
const logger = require('pino-http')({
    // Reuse an existing logger instance
    logger: pino(),
  
    // Define a custom request id function
    genReqId: function (req) { return req.id },
  
    // Define custom serializers
    serializers: {
      err: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res
    },
  
    // Set to `false` to prevent standard serializers from being wrapped.
    wrapSerializers: true,
  
    // Logger level is `info` by default
    // useLevel: 'info',
  
    // Define a custom logger level
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn'
      } else if (res.statusCode >= 500 || err) {
        return 'error'
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'silent'
      }
      return 'info'
    },
  
    // Define a custom success message
    customSuccessMessage: function (req, res) {
      if (res.statusCode === 404) {
        return 'resource not found'
      }
      return `${req.method} completed`
    },
  
    // Define a custom receive message
    customReceivedMessage: function (req, res) {
      return 'request received: ' + req.method
    },
  
    // Define a custom error message
    customErrorMessage: function (req, res, err) {
      return 'request errored with status code: ' + res.statusCode
    },
  
    // Override attribute keys for the log object
    customAttributeKeys: {
      req: 'request',
      res: 'response',
      err: 'error',
      responseTime: 'timeTaken'
    },
  
    // Define additional custom request properties
    customProps: function (req, res) {
      return {
        customProp: req.customProp,
        // user request-scoped data is in res.locals for express applications
        customProp2: res.locals.myCustomData
      }
    }
  })

const { homeInfo } = require('./mysql/query')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// 设置主机名
const hostName = '127.0.0.1'

// 接口转发
// const devProxy = {
//     target: 'http://localhost', // 测试服
//     pathRewrite: { '^/api': '/' },
//     changeOrigin: true
// }

function requestApiAll(req, res, next) {
    const { origin, Origin, referer, Referer } = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
        res.header("Access-Control-Allow-Origin", allowOrigin);
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Credentials", true); 
        res.header("X-Powered-By", 'Express');
        logger(req, res)
        req.log.info(req)
        if (req.method == 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next()
    }
}

app.prepare().then(() => {
    const server = express()

    // 设置/api请求头
    server.all('/api/*', (req, res, next) => requestApiAll(req, res, next))

    // 请求首页数据库数据
    server.get('/api/home', async (req, res, next) => {
        const data = await homeInfo()
        res.send({ home: data })
    })

    // 所有接口转发
    server.all('*', (req, res, next) => {
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl
        if (pathname.indexOf('/api') === -1) {
            handle(req, res)
        } else {
            next()
        }
    })

    // server.use('/api', proxy(devProxy))

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`)
    })
})