// server.js

// init project
import express from 'express';
import * as automationClient from '@atomist/automation-client';
import * as antlr from '@atomist/antlr';
import { AddressInfo } from 'net';
var app = express();
var pj = require('./package.json');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('static'));
app.use(express.static('public'));

app.use(express.json()); // do things right

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/app/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + (listener.address() as AddressInfo).port);
});

app.get("/dependencies", (req, res) => {
  res.send(pj.dependencies);
});

function stn(tn) {
  const children = (tn.$children || []).map(stn);
  return {
    name: tn.$name,
    children,
    value: children.length > 0 ? undefined : tn.$value
  }
}

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

  const f = new automationClient.InMemoryProjectFile("src/main/java/Foo.java", req.body.code);
  const ast = await antlr.JavaFileParser.toAst(f)

  response.send({ ast: stn(ast) });

});
