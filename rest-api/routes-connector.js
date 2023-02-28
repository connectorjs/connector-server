const spamCheck = require(path.join(__root, '/lib/spamdetector'))

module.exports = (app) => new Promise((resolve, reject) => {

  // const moduleHolder = await util.moduleLoader(path.join(__dirname, '/connector-controllers'), '.controller.js')
  app.all('/connector', function (req, res) {
    res.status(200).json({ success: true, data: 'Welcome to connector rest api. Usage: /connector/:func/[:param1]/[:param2]/[:param3] Methods: GET, POST, PUT, DELETE ' })
  })
  clientControllers(app, '/connector/:func/:param1/:param2/:param3')

  resolve()
})


function clientControllers(app, route) {
  setRoutes(app, route, async (req, res, next) => {
    
    let ctl = getController('connector-controllers', req.params.func)
    if (ctl) {
      clientPassport(req)
        .then(connector => {
          let params = {}
          Object.assign(params, req.body || {}, req.query || {})
          try {
            ctl(connector, params, req)
              .then(data => {
                if (data === undefined)
                  res.json({ success: true })
                else if (data === null)
                  res.json({ success: true })
                else {
                  res.status(200).json({ success: true, data: data })
                }
              })
              .catch(err=>global.responseError(err, res))
          } catch (err) {
            global.responseError(err, res)
          }
        })
        .catch(err=>global.responseError(err, res))
    } else {
      res.status(404).json({ success: false, error: { name: '404', message: 'function not found.' } })
    }

  })

}


function clientPassport(req) {
  return new Promise(async (resolve, reject) => {
    let IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || ''
    let isSpam = spamCheck(IP)
    if (isSpam) {
      reject({ name: 'SPAM', message: `Your request has been detected as spam. Try again after ${Math.ceil(isSpam / 60)} minutes later.` })
    } else {
      let clientId = req.headers.clientid || req.headers.clientId || req.body.clientId || req.query.clientId ||  ''
      let clientPass = req.headers.clientpass || req.headers.clientPass || req.body.clientPass || req.query.clientPass || ''
      if (clientId && clientPass) {
        db.connectors.findOne({ clientId: clientId, clientPass: clientPass })
          .then(connDoc => {
            if (connDoc == null) {
              if (spamCheck(IP)) {
                reject({ name: 'SPAM', message: `Your request was detected as spam. After 60 minutes, try again` })
              } else {
                reject({ name: 'AUTH', message: `Connector Authentication failed.` })
              }
            } else {
              if (global.wss.socketListByClientId[connDoc.clientId]) {
                let connector = connDoc.toJSON()
                connector.socket = global.wss.socketListByClientId[connDoc.clientId]
                resolve(connector)
              } else {
                reject({ name: 'OFFLINE', message: 'Connector is not active now.' })
              }
            }
          })
          .catch(reject)
      } else {
        if (spamCheck(IP)) {
          reject({ name: 'SPAM', message: `Your request was detected as spam. After 60 minutes, try again` })
        } else {
          reject({ name: 'AUTH', message: `Connector Authentication failed.` })
        }
      }
    }
  })
}


function getController(folder, funcName) {
  let controllerName = path.join(__dirname, folder, `generic-command.controller.js`)
  if (['message', 'mssql', 'mysql', 'pg', 'read-excel', 'write-excel', 'read-file', 'write-file', 'datetime', 'cmd'].includes(funcName) == false){
    controllerName = path.join(__dirname, folder, `${funcName}.controller.js`)
  }
  console.log(`controllerName`, controllerName)

  if (fs.existsSync(controllerName) == false) {
    return null
  } else {
    return require(controllerName)
  }
}
