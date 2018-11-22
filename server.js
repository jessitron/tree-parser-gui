"use strict";
// server.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// init project
const express_1 = __importDefault(require("express"));
const automationClient = __importStar(require("@atomist/automation-client"));
const antlr = __importStar(require("@atomist/antlr"));
var app = express_1.default();
var pj = require('./package.json');
// http://expressjs.com/en/starter/static-files.html
app.use(express_1.default.static('static'));
app.use(express_1.default.static('public'));
app.use(express_1.default.json()); // do things right
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
    response.sendFile(__dirname + '/app/index.html');
});
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
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
    };
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
    const ast = await antlr.JavaFileParser.toAst(f);
    response.send({ ast: stn(ast) });
});
