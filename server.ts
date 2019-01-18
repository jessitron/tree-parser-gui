// server.js

// init project
import express from 'express';
import { AddressInfo } from 'net';
var app = express();
var pj = require('./package.json');
import { Microgrammar } from "@atomist/microgrammar";
import { MicrogrammarBasedFileParser } from '@atomist/automation-client/lib/tree/ast/microgrammar/MicrogrammarBasedFileParser';
import { InMemoryProjectFile, InMemoryProject } from '@atomist/automation-client';
import { DataToParse, ParserSpec, ParseResponse } from './app/TreeParseGUIState';
import { FileParser } from '@atomist/automation-client/lib/tree/ast/FileParser';
import { TreeNode } from '@atomist/tree-path';
import stringify from "json-stringify-safe";
import { findMatches } from '@atomist/automation-client/lib/tree/ast/astUtils';
import { Java9FileParser } from "@atomist/antlr";
import { RemarkFileParser } from "@atomist/sdm-pack-markdown";


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

  try {
    const ast = await parser.toAst(new InMemoryProjectFile("hello", parseData.code));

    const matches = await findMatches(InMemoryProject.of({ path: "hello", content: parseData.code }),
      parser, "**/*", parseData.pathExpression);

    const noncircularAst = matches.map(simplifyTree);

    console.log(stringify(noncircularAst));

    const parseResponse: ParseResponse = { ast: noncircularAst };
    response.send(parseResponse);
  } catch (e) {
    response.send({ error: { message: e.message } })
  }
});

function simplifyTree(tn: TreeNode): TreeNode {
  const children = (tn.$children || []).map(simplifyTree);
  const output = {
    $name: tn.$name,
    $offset: tn.$offset,
    $value: tn.$value,
    $children: children,
  }
  return output;
}

function fromParserSpec(ps: ParserSpec): FileParser {
  switch (ps.kind) {
    case "microgrammar":

      console.log("Received mg string: " + ps.microgrammarString);

      const mg = Microgrammar.fromString(ps.microgrammarString, {
        // TODO: these terms should be passed in
        first: /[a-zA-Z0-9]+/,
        second: /[a-zA-Z0-9]+/,
      });

      return new MicrogrammarBasedFileParser("root", ps.matchName, mg);
    case "Java9":
      return Java9FileParser;
    case "Markdown":
      return RemarkFileParser;
  }
}

