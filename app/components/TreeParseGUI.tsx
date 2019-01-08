import React from 'react';
import { Submit } from './codeSubmission/submit';
import { CodeDisplay } from './codeSubmission/codeDisplay';
import { Tree } from './jsonDisplay/tree';
import { TalkOutLoud } from './TalkOutLoud';
import { TreeParseGUIState, DataToParse, AST } from '../TreeParseGUIState';
import { highlightFn } from './codeSubmission/highlightCode';

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
      ast: {},
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

  handleCodeSubmit = async (data: DataToParse) => {
    console.log("in handleCodeSubmit. data: ", data);
    this.setState({ dataToParse: data, ast: await getTree(data) });
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
              highlightFn={highlightFn(this.state.ast)}
              setSelectedWordsAndRanges={this.setSelectedWordsAndRanges}
            />
          </div>
          <Tree
            ast={this.state.ast} />
        </div>
        <p>Working with @atomist/antlr version: {this.state.deps["@atomist/antlr"]}</p>
      </div>
    );
  }
}


async function getTree(dataToParse: DataToParse) {
  const response = await fetch('/parse', {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(dataToParse), // body data type must match "Content-Type" header
  });
  const json = await response.json();
  return json.ast as AST;
}