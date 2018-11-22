"use strict";
// credit: https://codepen.io/austinlyons/pen/ZLEKgN
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
var Inspector = require('react-json-inspector');
const startingTree = { name: "compilationUnit" };
var AvailableParsers;
(function (AvailableParsers) {
    AvailableParsers["Java9"] = "Java9";
    AvailableParsers["Markdown"] = "Markdown";
})(AvailableParsers || (AvailableParsers = {}));
const availableParsers = [{ value: AvailableParsers.Java9, label: "Java" },
    { value: AvailableParsers.Markdown, label: "Markdown" }];
class EssayForm extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: 'class Foo { }',
            parserChoice: availableParsers[0].value,
            ast: startingTree,
        };
        // wat
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleParserChoiceChange = this.handleParserChoiceChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleCodeChange(event) {
        this.setState(Object.assign({}, this.state, { code: event.target.value }));
    }
    handleParserChoiceChange(event) {
        this.setState(Object.assign({}, this.state, { parserChoice: event.target.value }));
    }
    handleSubmit(event) {
        console.log('An essay was submitted: ' + this.state.code);
        event.preventDefault();
        const data = { code: this.state.code, parserChoice: this.state.parserChoice };
        return fetch('/parse', {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json()) // parses response to JSON
            .then(j => this.setState(Object.assign({}, this.state, { ast: j.ast })))
            .catch(error => console.error(error));
    }
    renderTree(tree) {
        return JSON.stringify(tree);
    }
    radioInputs(name, valueAndLabelses) {
        const oneInput = (value, label) => {
            return react_1.default.createElement("div", { key: value },
                react_1.default.createElement("input", { type: "radio", id: value, name: name, value: value, onChange: this.handleParserChoiceChange, checked: this.state.parserChoice == value }),
                react_1.default.createElement("label", null, label));
        };
        return valueAndLabelses.map(o => oneInput(o.value, o.label));
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: "essayForm" },
                react_1.default.createElement("form", { onSubmit: this.handleSubmit },
                    react_1.default.createElement("div", null, "Choose a parser"),
                    this.radioInputs("parserChoice", availableParsers),
                    react_1.default.createElement("div", null, "Code to parse"),
                    react_1.default.createElement("textarea", { value: this.state.code, onChange: this.handleCodeChange, cols: 40, rows: 10 }),
                    react_1.default.createElement("input", { type: "submit", value: "Submit" }))),
            react_1.default.createElement("div", { className: "preview" },
                react_1.default.createElement("h1", null, "Preview"),
                react_1.default.createElement(Inspector, { data: this.state.ast }))));
    }
}
exports.EssayForm = EssayForm;
