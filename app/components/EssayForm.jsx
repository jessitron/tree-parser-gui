// credit: https://codepen.io/austinlyons/pen/ZLEKgN

const React = require('react');
var Inspector = require('react-json-inspector');

const startingTree = { name: "compilationUnit" };

const availableParsers = [{ value: "Java9", label: "Java" },
{ value: "Markdown", label: "Markdown" }];

class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: 'class Foo { }',
      parserChoice: availableParsers[0].value,
      ast: startingTree,
    };

    this.handleChange = this.handleCodeChange.bind(this);
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

  radioInputs(name, valueAndLabelses, checkedness) {
    const oneInput = (value, label) => {
      return <div>
        <input type="radio" id={value} name={name} value={value}
          onChanged={this.handleParserChoiceChange}
          checked={checkedness} />
        <label for={value}>{value}</label>
      </div>
    }

    return valueAndLabelses.map((o, i) => oneInput(o.value, o.label, i === 0));
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
          <Inspector data={this.state.ast} />
        </div>
      </div>
    );
  }

}

module.exports = EssayForm;