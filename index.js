const WebSocket = require('ws')
const https = require('https')
const fs = require('fs')

const config = require('./config.json')

const server = https.createServer({
  key: fs.readFileSync(config.certificates.key),
  cert: fs.readFileSync(config.certificates.cert)
})

const wss = new WebSocket.Server({ server })

wss.on('connection', (ws) => {
  console.log(`[SERVER] connection()`)
  ws.on('message', (message) => {
    console.log(`[SERVER] Received: ${message}`)
    ws.send(`ECHO: ${message}`, (error) => {
      console.log(`[SERVER] error: ${error}`)
    })
  })
})

server.listen(config.port)
