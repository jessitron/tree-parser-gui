import React from 'react';
import { Submit } from './codeSubmission/submit';
import { CodeDisplay } from './codeSubmission/codeDisplay';
import { Tree } from './jsonDisplay/tree';
import { TalkOutLoud } from './TalkOutLoud';
import { TreeParseGUIState, DataToParse } from '../TreeParseGUIState';

/* the main page for the index route of this app */
export class TreeParseGUI extends React.Component<{},
  TreeParseGUIState> {

  constructor(props) {
    super(props);
    this.state = {
      deps: [],
      selectedWords: [],
      selectedRanges: [],
      displayCode: false,
      dataToParse: {
        code: "",
        microgrammarString: "<${first}><${second}>",
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
  handleCodeSubmit = (data: DataToParse) => {
    console.log("in handleCodeSubmit. data: ", data)
    this.setState({ dataToParse: data })
  }

  setSelectedWordsAndRanges = (words, ranges) => {
    this.setState({ selectedWords: words, selectedRanges: ranges })
    console.log("in tree parserGUI component: ", words, ranges)
  };

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
              setSelectedWordsAndRanges={this.setSelectedWordsAndRanges}
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