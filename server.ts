// server.js

// init project
import express from 'express';
import { AddressInfo } from 'net';
var app = express();
var pj = require('./package.json');
import { Microgrammar } from "@atomist/microgrammar";

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('static'));
app.use(express.static('public'));

app.use(express.json()); // do things right

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/app/index.html');
});

// listen for requests :)
var listener = app.listen(5000, function () {
  console.log('Your app is listening on port ' + (listener.address() as AddressInfo).port);
});

app.get("/dependencies", (req, res) => {
  res.send(pj.dependencies);
});

app.post("/parse", async (req, response) => {

  if (!req.body) {
    response.status(500);
    response.send("no body");
    return;
  }
  if (!req.body.code) {
    response.status(500);
    response.send("please send a string of code");
    return;
  }

  console.log("Received code to parse: " + req.body.code);
  const content = req.body.code;

  const element = Microgrammar.fromString("<${namex}>", {
    namex: /[a-zA-Z0-9]+/,
  });
  const mg = Microgrammar.fromString("${first}${second}", {
    first: element,
    second: element,
  });
  const ast = mg.findMatches(content);


  response.send({ ast });

});

