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
  console.log(allTokens)
  if(allTokens.exists()){
    var tokens = []
    for(var i=0;i<allTokens.length;i++){
      tokens.push(allTokens[i].val())
      console.log(allTokens[i].val())
    }
  }
    //const reponse = admin.messaging().sendToDevice(tokens,payload)
    //await cleanUp(response,tokens)
    res.status(200)
  }));

function cleanUp(response,tokens){
  const tokensToRemove = {}
  response.results.forEach((result,index) => {
    const error = result.error
    if(err){
      console.error('Failure sending notification to', tokens[index], error)
      if (error.code === 'messaging/invalid-registration-token' ||
         error.code === 'messaging/registration-token-not-registered') {
       tokensToRemove[`/fcmTokens/${tokens[index]}`] = null;
     }
    }
  })
}
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
