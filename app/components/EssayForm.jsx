// credit: https://codepen.io/austinlyons/pen/ZLEKgN

const React = require('react');
var Inspector = require('react-json-inspector');

const startingTree = { name: "compilationUnit" };

class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: 'class Foo { }',
      ast: startingTree,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ code: event.target.value });
  }

  handleSubmit(event) {
    console.log('An essay was submitted: ' + this.state.code);
    event.preventDefault();

    const data = { code: this.state.code };

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

  render() {
    return (
      <div>
        <div className="essayForm">
          <form onSubmit={this.handleSubmit}>
            <div>Code to parse</div>
            <textarea value={this.state.code} onChange={this.handleChange} cols={40} rows={10} />
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