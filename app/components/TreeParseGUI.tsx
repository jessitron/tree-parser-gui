import React from 'react';
import { Submit } from './codeSubmission/submit';
import { Tree } from './jsonDisplay/tree';
import { TalkOutLoud } from './TalkOutLoud';
import { TreeParseGUIState, DataToParse, AST } from '../TreeParseGUIState';
import { HighlightFunction, highlightFromAst } from './codeSubmission/highlightCode';
import * as _ from "lodash";
import { AppBar, Typography } from '@material-ui/core/';

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

  updateTree = _.debounce(async () => {
    const newAst = await getTree(this.state.dataToParse);
    this.setState({ ast: newAst })
  }, 500);

  handleCodeSubmit = async (data: Partial<DataToParse>) => {
    console.log("in handleCodeSubmit. data: ", data);
    this.setState(s => ({ dataToParse: { ...s.dataToParse, ...data }, ast: [] }))
    this.updateTree();
  }

  highlightFn: HighlightFunction = (offset: number) => highlightFromAst(this.state.ast, offset);

  setSelectedWordsAndRanges = (words, ranges) => {
    this.setState({ selectedWords: words, selectedRanges: ranges })
    console.log("in tree parserGUI component: ", words, ranges)
  }

  styles = {
    header: {
      padding: "1em 2em",
      marginBottom: "1em",
      display: "flex",
      flexFlow: "row nowrap",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundImage: "linear-gradient(to bottom right, #227F7E, #5bc399"
    }
  }

  render() {
    console.log("rendering hello");
    return (
      <div className="gooeyOutside">
        <TalkOutLoud everything={this.state} ></TalkOutLoud>
        <AppBar color="secondary" style={this.styles.header}>
          <Typography
            variant="title"

          >
            Parse My Code!
          </Typography>
          <img src="https://atomist.com/img/Atomist-Logo-White-Horiz.png" style={{ width: '15%', height: '50%' }}></img>
        </AppBar>
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
        <p style={{ color: "white" }}>Working with @atomist/antlr version: {this.state.deps["@atomist/antlr"]}</p>
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
