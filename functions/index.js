const functions = require('firebase-functions');
const admin = require('firebase-admin');
var async = require('asyncawait/async')
var await = require('asyncawait/await')
admin.initializeApp()

exports.sendMessage = functions.https.onRequest(async ((req,res) => {
  const payload = {
    "data": {
      heading: req.body.heading,
      content: req.body.content
    }
  }
  const allTokens = await (admin.database().ref('ref').once('value'))
  var resp = {
    "result": "Tokens not present"
  }
  if(allTokens.exists()){
    const data = allTokens.val()
    const keys = Object.keys(allTokens.val())
    const tokens = []
    for(var i=0;i<keys.length;i++){
      tokens.push(data[keys[i]])
    }
    console.log(tokens)
    const response = admin.messaging().sendToDevice(tokens,payload)
    await (cleanUp(response, tokens,keys))
    resp["result"] = "Success"
  }
    res.status(304).send(resp)
  }));

function cleanUp(response,tokens,keys){
  const tokensToRemove = {}
  response.results.forEach((result,index) => {
    const error = result.error
    if(err){
      console.error('Failure sending notification to', tokens[index], error)
      if (error.code === 'messaging/invalid-registration-token' ||
         error.code === 'messaging/registration-token-not-registered') {
       tokensToRemove[`/data/fcmTokens/${keys[index]}`] = null;
     }
    }
  })
  return admin.database().ref().update(tokensToRemove)
}