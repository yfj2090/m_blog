const express = require('express')
const proxy = require('express-http-proxy')
const next = require('next')
const { parse } = require('url')


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