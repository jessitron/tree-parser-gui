"use strict";
// credit: https://codepen.io/austinlyons/pen/ZLEKgN
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_json_view_1 = __importDefault(require("react-json-view"));
const core_1 = require("@material-ui/core");
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
        this.handleCodeChange = (event) => {
            this.setState(Object.assign({}, this.state, { code: event.target.value }));
        };
        this.handleParserChoiceChange = (event) => {
            this.setState(Object.assign({}, this.state, { parserChoice: event.target.value }));
        };
        this.handleSubmit = (event) => {
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
        };
        this.state = {
            code: '',
            parserChoice: availableParsers[0].value,
            ast: startingTree,
        };
    }
    renderTree(tree) {
        return JSON.stringify(tree);
    }
    radioInputs(name, valueAndLabelses) {
        const oneInput = (value, label) => {
            return react_1.default.createElement(core_1.FormControlLabel, { value: value, name: name, control: react_1.default.createElement(core_1.Radio, null), label: label });
        };
        return valueAndLabelses.map(o => oneInput(o.value, o.label));
    }
    render() {
        return (react_1.default.createElement("div", { style: { display: "flex" } },
            react_1.default.createElement("div", { className: "essayForm", style: { width: "50%" } },
                react_1.default.createElement("form", { onSubmit: this.handleSubmit, style: { backgroundColor: "#f0f0f0", width: "100%" } },
                    react_1.default.createElement(core_1.FormControl, null,
                        react_1.default.createElement(core_1.FormLabel, { component: "legend" }, "Choose A Parser"),
                        react_1.default.createElement(core_1.RadioGroup, { value: this.state.parserChoice, onChange: this.handleParserChoiceChange }, this.radioInputs("parserChoice", availableParsers))),
                    react_1.default.createElement(core_1.TextField, { style: { margin: "1em", width: "100%" }, label: "Code To Parse", value: this.state.code, variant: "outlined", onChange: this.handleCodeChange, multiline: true, rows: 15 }),
                    react_1.default.createElement(core_1.Button, { style: { margin: "1em" }, variant: "contained", color: "primary", type: "submit" }, "Submit"))),
            react_1.default.createElement("div", { className: "preview", style: { width: "50%" } },
                react_1.default.createElement("h1", null, "Preview"),
                react_1.default.createElement(react_json_view_1.default, { src: this.state.ast, theme: "apathy", displayDataTypes: false, onSelect: (select) => console.log("Selected: " + JSON.stringify(select)) }))));
    }
}
exports.EssayForm = EssayForm;
