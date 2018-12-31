const functions = require('firebase-functions');
const admin = require('firebase-admin');
var async = require('asyncawait/async')
var await = require('asyncawait/await')
const config = require('./config.js')
admin.initializeApp()

exports.sendMessage = functions.https.onRequest(async ((req,res) => {
  if(req.body.api_key == config.API_KEY){
  const payload = {
    data: {
      "heading": req.body.heading+"",
      "content": req.body.content+""
    }
  }
  const allTokens = await (admin.database().ref('/data/fcm_tokens').once('value'))
  if(allTokens.exists()){
    const data = allTokens.val()
    const keys = Object.keys(data)
    const tokens = []
    for(var i=0;i<keys.length;i++){
      tokens.push(data[keys[i]])
    }
    const response = await (admin.messaging().sendToDevice(tokens,payload))
    console.log(response)
    await (cleanUp(response, tokens,keys))
  }
    res.status(304).send("Success")
  } 
  else{
    res.status(401).send("Unauthorized")
  }
  }));

function cleanUp(response,tokens,keys){
  const tokensToRemove = {}
  response.results.forEach((result,index) => {
    const error = result.error
    if(error){
      console.error('Failure sending notification to', tokens[index], error)
      if (error.code === 'messaging/invalid-registration-token' ||
         error.code === 'messaging/registration-token-not-registered') {
       tokensToRemove[`/data/fcm_tokens/${keys[index]}`] = null;
     }
    }
  })
  return admin.database().ref().update(tokensToRemove)
}