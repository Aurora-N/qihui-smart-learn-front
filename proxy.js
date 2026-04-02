import http from 'node:http'
import https from 'node:https'

const TARGET_HOST = 'nonrotatable-chara-laterally.ngrok-free.dev'
const TARGET_URL = `https://${TARGET_HOST}`
const PORT = 3456

const server = http.createServer((req, res) => {
  const options = {
    hostname: TARGET_HOST,
    port: 443,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: TARGET_HOST, // 需要重写 host 请求头
      'ngrok-skip-browser-warning': 'true',
    },
  }

  const proxyReq = https.request(options, proxyRes => {
    // 设置支持跨域请求（如果前端直接访问该代理并遇到CORS问题可用）
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    res.setHeader('Access-Control-Allow-Headers', '*')

    if (req.method === 'OPTIONS') {
      res.writeHead(200)
      res.end()
      return
    }

    res.writeHead(proxyRes.statusCode, proxyRes.headers)
    proxyRes.pipe(res, { end: true })
  })

  proxyReq.on('error', err => {
    console.error('Proxy request error:', err)
    res.writeHead(500)
    res.end('Proxy Error')
  })

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.writeHead(200)
    res.end()
    return
  }

  req.pipe(proxyReq, { end: true })
})

server.listen(PORT, () => {
  console.log(`[Proxy] Server running on http://localhost:${PORT}`)
  console.log(`[Proxy] Forwarding requests to ${TARGET_URL}`)
  console.log(`[Proxy] Added header 'ngrok-skip-browser-warning: true'`)
})
