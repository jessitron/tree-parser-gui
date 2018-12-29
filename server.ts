// server.js

// init project
import express from 'express';
import * as automationClient from '@atomist/automation-client';
import * as antlr from '@atomist/antlr';
import { AddressInfo } from 'net';
import { TreeNode } from '@atomist/tree-path';
import { RemarkFileParser } from "@atomist/sdm-pack-markdown";
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
var listener = app.listen(5000, function () {
  console.log('Your app is listening on port ' + (listener.address() as AddressInfo).port);
});

app.get("/dependencies", (req, res) => {
  res.send(pj.dependencies);
});

function condenseSingleChild(tn: TreeNode) {
  if (tn.$children && tn.$children.length === 1 && tn.$children[0].$offset === tn.$offset) {
    const condenseChild = condenseSingleChild(tn.$children[0]);
    return {
      $children: condenseChild.$children,
      $value: tn.$value,
      $name: `${tn.$name}/${condenseChild.$name}`,
      $offset: tn.$offset
    }
  }

  return {
    $children: tn.$children,
    $name: tn.$name,
    $offset: tn.$offset,
    $value: tn.$value,
  }
}

function stn(tn1) {
  const tn = condenseSingleChild(tn1);
  const children = (tn.$children || []).map(stn);
  return {
    name: `${tn.$offset} ${tn.$name}`,
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

  const parser = chooseParser(req.body.parserChoice);

  const f = new automationClient.InMemoryProjectFile("src/main/java/Foo.java", req.body.code);
  const ast = await parser.toAst(f)

  response.send({ ast: stn(ast) });

});


function chooseParser(choice: string): automationClient.FileParser<TreeNode> {
  switch (choice) {
    case "Java9":
      return antlr.Java9FileParser;
    case "Markdown":
      return RemarkFileParser
    default:
      throw new Error("Unknown parser: " + choice)
  }
}
