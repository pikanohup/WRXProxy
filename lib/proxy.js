const debug = require('debug')
const WebSocket = require('ws')
// const Pool = require('./pool')

class Proxy {
  constructor (options) {
    options = options || {}
    this._port = options.port
    // this._pool = new Pool(options.pool)
    this.debug = debug('proxy')
  }

  start () {
    this._connect()
  }

  _connect () {
    if (!this._server) {
      this._server = new WebSocket.Server({ port: this._port })
      this._server.on('connection', this._onConnection.bind(this))
    }
  }

  _onConnection (socket, request) {
    this.debug(`[SERVER] connection()`)
    this._socket = socket
    this._socket.onmessage = this._onMessage.bind(this)
  }

  _onMessage (message) {
    this.debug(`[SERVER] Received: ${message}`)
    this._socket.send(`ECHO: ${message}`)
  }
}

module.exports = Proxy
