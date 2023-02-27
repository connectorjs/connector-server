module.exports = (connector, params, req) => new Promise((resolve, reject) => {
	// let apiName = path.basename(__filename, '.controller.js')
	let apiName = req.params.func
	let callback = apiName + '_' + uuid.v4()
  let obj={}
  Object.assign(obj,{},params)
  obj.event=apiName
  obj.callback=callback

	connector.socket.callbackList[callback] = (result) => {
    console.log('socket callbackList length A:', Object.keys(connector.socket.callbackList))
    console.log(`callback calisti `, callback , ' result:', result )
		delete connector.socket.callbackList[callback]
    if (result.success)
			resolve(result.data)
		else
			reject(result.error)

    console.log('socket callbackList length B:', Object.keys(connector.socket.callbackList))
	}

  
	if (['GET', 'POST', 'PUT'].includes(req.method)) {
		connector.socket.send(JSON.stringify(obj))
	} else
		restError.method(req, reject)
})
