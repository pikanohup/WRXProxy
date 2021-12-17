const WebSocket = require('ws')
const fs = require('fs')

const config = require('./config.json')

const wss = new WebSocket.Server({ port: config.port })

wss.on('connection', (ws) => {
  console.log(`[SERVER] connection()`)
  ws.on('message', (message) => {
    console.log(`[SERVER] Received: ${message}`)
    ws.send(`ECHO: ${message}`, (error) => {
      console.log(`[SERVER] error: ${error}`)
    })
  })
})
