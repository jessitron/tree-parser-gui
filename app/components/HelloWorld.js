"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const EssayForm_1 = require("./EssayForm");
/* the main page for the index route of this app */
class HelloWorld extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            deps: []
        };
    }
    componentDidMount() {
        fetch('/dependencies')
            .then(response => response.json())
            .then(data => {
            console.log("here is the data");
            console.log(data);
            this.setState({
                deps: data
            });
        });
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("h1", null, "Parse My Code!"),
            react_1.default.createElement("p", null,
                "Working with @atomist/antlr version: ",
                this.state.deps["@atomist/antlr"]),
            react_1.default.createElement(EssayForm_1.EssayForm, null)));
    }
}
module.exports = HelloWorld;
