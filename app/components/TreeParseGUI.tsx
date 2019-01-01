import React from 'react';
import { Submit } from './codeSubmission/submit';
import { CodeDisplay } from './codeSubmission/codeDisplay';
import { Tree } from './jsonDisplay/tree';
import { TalkOutLoud } from './TalkOutLoud';
import { TreeParseGUIState } from '../TreeParseGUIState';

/* the main page for the index route of this app */
export class TreeParseGUI extends React.Component<{},
  TreeParseGUIState> {

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
    this.setState({ dataToParse: data })
    this.toggleDisplay();
  }
  toggleDisplay() {
    this.setState({ displayCode: !this.state.displayCode });
  }

  render() {
    console.log("rendering hello");
    return (
      <div>
        <TalkOutLoud everything={this.state}></TalkOutLoud>
        <h1>Parse My Code!</h1>

        <div style={{ display: "flex" }}>
          <div className="code-view">
              <Submit
                handleCodeSubmit={this.handleCodeSubmit}
              />
          </div>
          <Tree
            dataToParse={this.state.dataToParse} />
        </div>
        <p>Working with @atomist/antlr version: {this.state.deps["@atomist/antlr"]}</p>
      </div>
    );
  }
}