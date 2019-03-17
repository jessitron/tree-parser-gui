// server.js

// init project
import { Java9FileParser } from "@atomist/antlr";
import { InMemoryProject } from "@atomist/automation-client";
import { findMatches } from "@atomist/automation-client/lib/tree/ast/astUtils";
import { FileParser } from "@atomist/automation-client/lib/tree/ast/FileParser";
import { RemarkFileParser } from "@atomist/sdm-pack-markdown";
import { TreeNode } from "@atomist/tree-path";
import express from "express";
import stringify from "json-stringify-safe";
import { AddressInfo } from "net";
import { DataToParse, ErrorResponse, KnownErrorLocation, ParseResponse, ParserSpec } from "./app/TreeParseGUIState";
import pj from "./package.json";

// do things right
process.on("uncaughtException", function(exception) {
  console.log(exception); // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
});

const app = express();
// http://expressjs.com/en/starter/static-files.html
app.use(express.static("static"));
app.use(express.static("public"));

app.use(express.json()); // do things right

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/app/index.html");
});

// listen for requests :)
const listener = app.listen(5000, () => {
  console.log("Your app is listening on port " + (listener.address() as AddressInfo).port);
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

  try {
    const parseData = req.body as DataToParse;
    const parser = fromParserSpec(parseData.parser);

    const matches = await findMatches(InMemoryProject.of({ path: "hello", content: parseData.code }),
      parser, "**/*", parseData.pathExpression);

    const noncircularAst = matches.map(simplifyTree);

    console.log(stringify(noncircularAst));

    const parseResponse: ParseResponse = { ast: noncircularAst };
    response.send(parseResponse);
  } catch (e) {
    console.error(e.stack);
    const result: ErrorResponse = {
      error:
      {
        message: e.message,
        complainAbout: e.where,
        tree: e.tree,
      },
    };
    response.send(result);
  }
});

function simplifyTree(tnin: TreeNode): TreeNode {
  const tn = condenseSingleChild(tnin);
  const children = (tn.$children || []).map(simplifyTree);
  const output = {
    $name: tn.$name,
    $offset: tn.$offset,
    $value: tn.$value || "",
    $children: children,
  };
  return output;
}

function condenseSingleChild(tn: TreeNode) {
  if (tn.$children && tn.$children.length === 1 && tn.$children[0].$offset === tn.$offset) {
    const condenseChild = condenseSingleChild(tn.$children[0]);
    return {
      $children: condenseChild.$children,
      $value: tn.$value,
      $name: `${tn.$name}/${condenseChild.$name}`,
      $offset: tn.$offset,
    };
  }

  return {
    $children: tn.$children,
    $name: tn.$name,
    $offset: tn.$offset,
    $value: tn.$value,
  };
}

function fromParserSpec(ps: ParserSpec): FileParser {
  switch (ps.kind) {
    case "Java9":
      return Java9FileParser;
    case "Markdown":
      return RemarkFileParser;
  }
}

class LocalizedError extends Error {
  constructor(public readonly where: KnownErrorLocation,
              message: string,
              public readonly tree?: TreeNode) {
    super(message);
  }
}
