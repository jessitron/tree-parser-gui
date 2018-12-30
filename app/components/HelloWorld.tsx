import React from 'react';
import {Submit} from './codeSubmission/submit';
import {CodeDisplay} from './codeSubmission/codeDisplay';
import {Tree} from './jsonDisplay/tree';

/* the main page for the index route of this app */
class HelloWorld extends React.Component<{}, 
{ 
  deps: string[],
  displayCode: boolean,
  dataToParse: {
    code: string,
    parserChoice: string
  },
 }> {

  constructor(props) {
    super(props);
    this.state = {
      deps: [],
      displayCode: false,
      dataToParse: {
        code: "",
        parserChoice: ""
      },
    }
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
  handleCodeSubmit = (data) => {
    console.log("in handleCodeSubmit. data: ", data)
    this.setState({dataToParse: data})
    this.toggleDisplay();
  }
  toggleDisplay() {
    this.setState({displayCode: !this.state.displayCode});
  }

  render() {
    return (
      <div>
        <h1>Parse My Code!</h1>
        <div style={{display: "flex"}}>
          {this.state.displayCode ? 
            <CodeDisplay
              dataToParse={this.state.dataToParse} /> :
            <Submit
              handleCodeSubmit={this.handleCodeSubmit}
            />
          }
            <Tree
              dataToParse={this.state.dataToParse} />
        </div>
        <p>Working with @atomist/antlr version: {this.state.deps["@atomist/antlr"]}</p>
      </div>
    );
  }
}

module.exports = HelloWorld;