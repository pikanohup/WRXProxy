const WebSocket = require('ws')

const wss = new WebSocket.Server({
  port: 443
})

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
      ws.send(`ECHO: ${message}`, (error) => {
          if (error) {
              console.log(`[SERVER] error: ${error}`)
          }
      })
  })
})
