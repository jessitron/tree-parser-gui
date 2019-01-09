import React from 'react';
import { Submit } from './codeSubmission/submit';
import { Tree } from './jsonDisplay/tree';
import { TalkOutLoud } from './TalkOutLoud';
import { TreeParseGUIState, DataToParse, AST } from '../TreeParseGUIState';
import { HighlightFunction, highlightFromAst } from './codeSubmission/highlightCode';
import { stringify } from 'querystring';

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
        code: "blah<other><thing> haha",
        microgrammarString: "<${first}><${second}>",
      },
      ast: [],
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

  handleCodeSubmit = async (data: Partial<DataToParse>) => {
    console.log("in handleCodeSubmit. data: ", data);
    const full: DataToParse = { ... this.state.dataToParse, ...data }
    this.setState(s => ({ dataToParse: { ...s.dataToParse, ...data }, ast: [] }))
    const newAst = await getTree(full);
    this.setState({ast: newAst })
  }

  highlightFn: HighlightFunction = (offset: number) => highlightFromAst(this.state.ast, offset);

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
              dataToParse={this.state.dataToParse}
              dataToParseUpdateFn={this.handleCodeSubmit}
              highlightFn={this.highlightFn}
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