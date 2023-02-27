
module.exports =async (app) => {

  let apiWelcomeMessage = { message: `Welcome to ${require(path.join(__root, 'package.json')).name || ''} API V1. Usage: /api/v1/:func/[:param1]/[:param2]/[:param3] . Methods: GET, POST, PUT, DELETE ` }
  app.all('/api', function (req, res) {
    res.status(200).json({ success: true, data: apiWelcomeMessage })
  })

  app.all('/api/v1', function (req, res) {
    res.status(200).json({ success: true, data: apiWelcomeMessage })
  })

  await require('./routes-connector')(app)
  
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    res.status(404).json({ success: false, error: { name: '404', message: 'function not found' } })
  })

  app.use((err, req, res, next) => {
    responseError(err, res)
  })
}

function getController(folder, funcName) {
  const controllerName = path.join(__dirname, folder, `${funcName}.controller.js`)
  if (fs.existsSync(controllerName) == false) {
    return false
  } else {
    return require(controllerName)
  }
}

global.setRoutes = (app, route, cb1, cb2) => {
  let dizi = route.split('/:')
  let yol = ''
  dizi.forEach((e, index) => {
    if (index > 0) {
      yol += `/:${e}`
      if (cb1 != undefined && cb2 == undefined) {
        app.all(yol, cb1)
      } else if (cb1 != undefined && cb2 != undefined) {
        app.all(yol, cb1, cb2)
      }
    } else {
      yol += e
    }
  })
}


global.responseError = (err, res) => {
  let error = { name: '403', message: '' }
  if (typeof err == 'string') {
    error.message = err
  } else {
    error.name = err.code || err.name || 'ERROR'
    if (err.message)
      error.message = err.message
    else
      error.message = err.name || ''
  }

  res.status(401).json({ success: false, error: error })
}

global.restError = {
  param1: function (req, next) {
    next({ name: 'INCORRECT_PARAMETER', message: `function:[/${req.params.func}] [/:param1] is required` })
  },
  param2: function (req, next) {
    next({ name: 'INCORRECT_PARAMETER', message: `function:[/${req.params.func}/${req.params.param1}] [/:param2] is required` })
  },
  method: function (req, next) {
    next({ name: 'INCORRECT_METHOD', message: `function:${req.params.func} WRONG METHOD: ${req.method}` })
  },
  auth: function (req, next) {
    next({ name: 'AUTH_FAILED', message: `Authentication failed` })
  },
  data: function (req, next, field) {
    if (field) {
      next({ name: 'INCORRECT_DATA', message: `"${field}" Incorrect or missing data` })

    } else {
      next({ name: 'INCORRECT_DATA', message: `Incorrect or missing data` })

    }
  }
}