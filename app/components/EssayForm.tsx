// credit: https://codepen.io/austinlyons/pen/ZLEKgN

import React from 'react';
import ReactJson from 'react-json-view';

const startingTree = { name: "compilationUnit" };

enum AvailableParsers {
  Java9 = "Java9",
  Markdown = "Markdown",
}

const availableParsers = [{ value: AvailableParsers.Java9, label: "Java" },
{ value: AvailableParsers.Markdown, label: "Markdown" }];

export class EssayForm extends React.Component<{}, {
  code: string,
  parserChoice: AvailableParsers,
  ast: any
}> {
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
    this.setState({ ...this.state, code: event.target.value });
  }

  handleParserChoiceChange(event) {
    this.setState({ ...this.state, parserChoice: event.target.value })
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
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
      .then(response => response.json()) // parses response to JSON
      .then(j => this.setState({ ...this.state, ast: j.ast }))
      .catch(error => console.error(error));
  }

  renderTree(tree) {
    return JSON.stringify(tree);
  }

  radioInputs(name, valueAndLabelses) {
    const oneInput = (value, label) => {
      return <div className="parserChoice" key={value}>
        <input className="parserChoice" type="radio" id={value} name={name} value={value}
          onChange={this.handleParserChoiceChange}
          checked={this.state.parserChoice == value} />
        <label>{label}</label>
      </div>
    }

    return valueAndLabelses.map(o => oneInput(o.value, o.label));
  }

  render() {
    return (
      <div>
        <div className="essayForm">
          <form onSubmit={this.handleSubmit}>
            <div>Choose a parser</div>
            {this.radioInputs("parserChoice", availableParsers)}

            <div>Code to parse</div>
            <textarea value={this.state.code} onChange={this.handleCodeChange} cols={40} rows={10} />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className="preview">
          <h1>Preview</h1>
          <ReactJson src={this.state.ast} />
        </div>
      </div>
    );
  }

}