import http from 'node:http'
import https from 'node:https'

const TARGET_HOST = 'nonrotatable-chara-laterally.ngrok-free.dev'
const TARGET_URL = `https://${TARGET_HOST}`
const PORT = 3456

const server = http.createServer((req, res) => {
  const startTime = Date.now()
  console.log(
    `[${new Date().toISOString()}] REQUEST  | ${req.method} ${req.url}`
  )

  res.on('finish', () => {
    const duration = Date.now() - startTime
    console.log(
      `[${new Date().toISOString()}] RESPONSE | ${req.method} ${req.url} | Status: ${res.statusCode} | ${duration}ms`
    )
  })

  const headers = {
    ...req.headers,
    host: TARGET_HOST, // 需要重写 host 请求头
    'ngrok-skip-browser-warning': 'true',
  }

  // 删除前端自带的跨域标识，将其伪装成浏览器直接请求
  delete headers.origin
  delete headers.referer

  const options = {
    hostname: TARGET_HOST,
    port: 443,
    path: req.url,
    method: req.method,
    headers,
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
    console.error(
      `[${new Date().toISOString()}] ERROR    | ${req.method} ${req.url} | ${err.message}`
    )
    if (!res.headersSent) {
      res.writeHead(500)
    }
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
