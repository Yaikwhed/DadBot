var HTTPS = require('https');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegexDad = /^(I|i)'?m([0-9a-zA-Z"-]|,|'| )*(\.|\?|\!|)/; 
  var dadToMom = ["This is why I'm always in my den.", "Oh yeah? Well, your meatloaf sucks.", "I'm only with you for the kids.", "I'm happy with blueballs if it means you have to keep your shirt on.",
                  "The chicken you make is as leathery as your skin.", "Would you shut up and bring me a beer?", "There's two things you and a football have in common: 1. I'd like to kick you hard as possible. 2. You've both been man handled by an obscene number of men.",
                  "If I ever go gay, it's your fault."]


  if(request.text && botRegexDad.test(request.text) && (request.text.indexOf("@") == -1) && (request.name.toUpperCase() != "GroupMe".toUpperCase()) && (request.name != "Dad") && textCheck(request.text, botRegexDad) == 1) {
    this.res.writeHead(200);
    postMessage("Hi, " + getResponseString(request.text, botRegexDad) + ". I'm Dad!");
    this.res.end();
  }
  else if(request.text && request.name == "Mum"){
    this.res.writeHead(200);
    postMessage(dadToMom[getRandomInt(0,dadToMom.length)]);
    this.res.end();
  }  
  else{
    console.log("Nothing happened");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(response) {
  var botResponse,options, body, botReq;

  botResponse = response

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

function getResponseString(text, dadRegex) {
  var match = dadRegex.exec(text);
  var matchingString = match[0];
  var punctCheck = matchingString.substring(matchingString.length-1, matchingString.length);
  var checkPoint = matchingString.indexOf("m");
  if(punctCheck == "." || punctCheck == "!" || punctCheck == "?"){
    return matchingString.substring(checkPoint+2, matchingString.length-1);
  }
  else
  {
    return matchingString.substring(checkPoint+2, matchingString.length);
  }  
} 

function textCheck(text, dadRegex){
  var match = dadRegex.exec(text);
  var matchingString = match[0];
  var checkPoint = matchingString.indexOf("m");
  if(matchingString.substring(checkPoint+1,checkPoint+2) == " "){
    return 1;
  }
  else{
    return 0;
  }  
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


exports.respond = respond;
