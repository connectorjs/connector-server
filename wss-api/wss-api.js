const WebSocketServer = require('ws').WebSocketServer
const url = require('url')


global.wss = null



module.exports = async function (httpServer) {

  const moduleHolder = await util.moduleLoader(path.join(__dirname, 'sockets'), '.socket.js')

  return new Promise(async (resolve, reject) => {

    global.wss = new WebSocketServer({
      server: httpServer,
      autoAcceptConnections: true,
      path: '/connector'
    })
    global.wss.socketListByUuid = {}
    global.wss.socketListByClientId = {}

    wss.on('connection', (socket, req) => {

      socket.ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || socket.conn.remoteAddress || '').split(',')[0].trim()
      socket.isAlive = true
      socket.lastPong = new Date()
      socket.id = uuid.v4()
      socket.pathname = url.parse(req.url).pathname
      socket.isConnector = true
      socket.subscribed = false
      socket.sendError = sendError
      socket.sendSuccess = sendSuccess
      global.wss.socketListByUuid[socket.id] = socket
      socket.callbackList = {}
      socket.connector = {
        _id: '',
        clientId: '',
        clientPass: '',
        lastUuid: socket.id,
        lastOnline: new Date(),
        lastIP: socket.ip
      }

      socket.on('pong', () => {
        socket.isAlive = true
        socket.lastPong
        moduleHolder.pong && moduleHolder.pong(socket)
      })

      socket.on('message', (rawData) => {
        try {
          let data = JSON.parse(rawData.toString())

          if (data.callback && socket.callbackList[data.callback]) {
            socket.callbackList[data.callback](data)
          } else {
            if (data.event && moduleHolder[data.event]) {
              moduleHolder[data.event](socket, data)
            } else {
              errorLog('[WssAPI]'.cyan, 'Unknown Wss function:', data.event.green)
            }
          }
        } catch (err) {
          errorLog('[WssAPI]'.cyan, err.name, err.message)
        }
      })

      socket.on('error', (err) => {
        errorLog('[WssAPI]'.cyan, err.name, err.message)
      })

      socket.on('close', () => {
        delete global.wss.socketListByUuid[socket.id]
        devLog('Disconnected socket.connector._id', socket.connector._id)
        purgeSocket(socket)
        eventLog(`Total client:`, wss._server._connections)
      })

      devLog('Connected', socket.ip, socket.id)
      eventLog(`Total client:`, wss._server._connections)
    })


    eventLog(`[WebsocketAPI]`.cyan, 'started')
    uyuyanlariGemidenAt()
    resolve()
  })
}

global.purgeSocket = (socket) => {
  try {
    delete global.wss.socketListByUuid[socket.id]
    socket.connector.clientId && delete global.wss.socketListByClientId[socket.connector.clientId]
    clearInterval(socket.timeIntervalId)
    clearInterval(socket.pingIntervalId)
    socket.terminate()
  } catch (err) {
    console.error(err)
  }
}

// throw the sleepers out of the boat

function uyuyanlariGemidenAt() {
  if (global.wss) {
    let gemidenAtildi = false
    global.wss.clients.forEach((socket) => {
      if (socket.isAlive === false) {
        purgeSocket(socket)
        gemidenAtildi = true
      } else {
        socket.isAlive = false
        socket.ping()
      }
    })


    gemidenAtildi && eventLog(`Total client:`, wss._server._connections)
  }

  setTimeout(() => {
    uyuyanlariGemidenAt()
  }, Number(process.env.WS_PING_INTERVAL || 5000))
}


function sendError(err, callback) {
  let socket = this
  let error = { name: 'Error', message: '' }
  if (typeof err == 'string') {
    error.message = err
  } else {
    error.name = err.name || 'Error'
    if (err.message)
      error.message = err.message
    else
      error.message = err.name || ''
  }

  let obj = {
    event: callback || 'error',
    success: false,
    error: error
  }
  devError(`[SendError]`.cyan, JSON.stringify(obj))
  socket.send(JSON.stringify(obj))
}

function sendSuccess(event, data, callback) {
  let socket = this
  let obj = {
    event: event,
    success: true,
    data: data
  }
  if (callback) {
    obj.callback = callback
  }
  devLog(`[SendSuccess]`.cyan, JSON.stringify(obj))
  socket.send(JSON.stringify(obj))
}
