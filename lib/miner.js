const debug = require('debug')
const WebSocket = require('ws')

class Miner {
  constructor (options) {
    options = options || {}
    this._port = options.port
    this._socket = null
    this._eventListeners = {
      auth: [],
      submit: [],
      error: [],
      close: []
    }
    this.debug = debug('miner')
  }

  start () {
    this._connect()
  }

  on (event, callback) {
    if (this._eventListeners[event]) {
      this._eventListeners[event].push(callback)
    }
  }

  send (type, params) {
    const data = {
      type: type,
      params: params || {}
    }
    this._socket.send(JSON.stringify(data))
    this.debug(`Sent: ${JSON.stringify(data)}`)
  }

  close () {
    if (this._socket && this._socket.readyState !== 3) this._socket.close()
  }

  clientIP () {
    return this._clientIP
  }

  _emit (event, params) {
    const listeners = this._eventListeners[event]
    if (listeners && listeners.length) {
      for (let i = 0; i < listeners.length; ++i) {
        listeners[i](params)
      }
    }
  }

  _connect () {
    if (!this._socket) {
      const server = new WebSocket.Server({ port: this._port })
      server.on('connection', this._onConnection.bind(this))
    }
  }

  _onConnection (socket, request) {
    this.debug('Connected')
    this._socket = socket
    this._clientIP = request.headers['x-forwarded-for'] || request.headers['x-real-ip'] ||
                     request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress
    this._socket.on('message', this._onMessage.bind(this))
    this._socket.on('error', this._onError.bind(this))
    this._socket.on('close', this._onClose.bind(this))
  }

  _onMessage (message) {
    const data = JSON.parse(message)
    this.debug(`Received: ${JSON.stringify(data)}`)
    this._emit(data.type, data.params)
  }

  _onError (error) {
    this.debug(`Error: ${error}`)
    this._emit('error')
    this._onClose()
  }

  _onClose () {
    this.debug(`Closed`)
    this._emit('close')
    this.close()
    this._socket = null
  }
}

module.exports = Miner
