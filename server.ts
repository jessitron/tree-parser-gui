// server.js

// init project
import express from 'express';
import { AddressInfo } from 'net';
var app = express();
var pj = require('./package.json');
import { Microgrammar } from "@atomist/microgrammar";
import { MicrogrammarBasedFileParser } from '@atomist/automation-client/lib/tree/ast/microgrammar/MicrogrammarBasedFileParser';
import { InMemoryProjectFile } from '@atomist/automation-client';
import { DataToParse, ParserSpec } from './app/TreeParseGUIState';
import { FileParser } from '@atomist/automation-client/lib/tree/ast/FileParser';
import { TreeNode } from '@atomist/tree-path';
import stringify from "json-stringify-safe";


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
  const parseData = req.body as DataToParse;
  const parser = fromParserSpec(parseData.parser);

  const ast = await parser.toAst(new InMemoryProjectFile("hello", parseData.code));

  const noncircularAst = simplifyTree(ast);

  console.log(stringify(noncircularAst));

  response.send({ ast: noncircularAst });

});

function simplifyTree(tn: TreeNode): object {
  const children = (tn.$children || []).map(simplifyTree);
  const output = {
    name: tn.$name,
    offset: tn.$offset,
    value: tn.$value,
    children,
  }
  const nonMoneyProperties = Object.keys(tn).filter(k => !k.startsWith("$"));
  console.log("copying properties: " + nonMoneyProperties.join())
  nonMoneyProperties.forEach(k => output[k] = tn[k]);
  return output;
}

function fromParserSpec(ps: ParserSpec): FileParser {
  if (ps.kind !== "microgrammar") {
    throw new Error("unsupported parser kind: " + ps.kind);
  }
  console.log("Received mg string: " + ps.microgrammarString);

  const mg = Microgrammar.fromString(ps.microgrammarString, {
    // TODO: these terms should be passed in
    first: /[a-zA-Z0-9]+/,
    second: /[a-zA-Z0-9]+/,
  });

  const p = new MicrogrammarBasedFileParser("root", ps.matchName, mg);
  return p;
}

