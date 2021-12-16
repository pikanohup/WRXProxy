const WebSocket = require('ws')
const https = require('https')
const fs = require('fs')

const config = require('./config.json')

const server = new https.createServer({
  key: fs.readFileSync('ssl/key.pem'),
  cert: fs.readFileSync('ssl/cert.pem')
})

const wss = new WebSocket.Server({ server })

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
      ws.send(`ECHO: ${message}`, (error) => {
          if (error) {
              console.log(`[SERVER] error: ${error}`)
          }
      })
  })
})

server.listen(config.port)
