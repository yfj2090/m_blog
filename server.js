const express = require('express')
const proxy = require('express-http-proxy')
const next = require('next')

const { homeInfo } = require('./mysql/query')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// 设置主机名
const hostName = '127.0.0.1'

// 接口转发
const devProxy = {
    target: 'http://localhost:80', // 测试服
    pathRewrite: { '^/api': '/' },
    changeOrigin: true
  }

app.prepare().then(() => {
    const server = express()

    // server.all('*', (req, res) => {
    //     return handle(req, res)
    // })

    // server.use('/api', proxy(devProxy))

    server.get('/api/home', async (req, res, next) => {
        const data = await homeInfo()
        console.log('1111111111111', data)
        res.send({ home: data })
    })

    server.listen(port, hostName, () => {
        console.log(`> Ready on ${hostName}:${port}`)
    })
})