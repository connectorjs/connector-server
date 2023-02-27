
(async ()=>{
  global.__root = __dirname
  await require('./lib/initialize')()
  await require('./db/db-loader')()
  var app=await require('./app')()
  var httpServer = await require('./lib/http-server')(process.env.HTTP_PORT, app)
  
  await require('./wss-api/wss-api')(httpServer)
  eventLog(`Application was started properly :-)`.yellow)

  // const { generateFromEmail, generateUsername } = require('unique-username-generator')
  // let s1=generateUsername('',0,6)
  // let s2=generateFromEmail(s1,2)
  // console.log(s1)
  // console.log(s2)
  

  // const forbiddenWords=['sex','gay','stupid']
  // var myString = 'I have an apple andse x a watermelon.'
  // var stringIncludesFruit = forbiddenWords.some(e => myString.includes(e))
  // console.log(`stringIncludesFruit`,stringIncludesFruit )

  process.env.NODE_ENV!='development' && process.on('uncaughtException', err => { errorLog('Caught exception: ', err) })
  process.env.NODE_ENV!='development' && process.on('unhandledRejection', err => { errorLog('Caught rejection: ', err) })
})()
