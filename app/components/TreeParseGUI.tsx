import React from 'react';
import { ParserInput } from './codeSubmission/ParserInput';
import { Tree, Theme } from './jsonDisplay/tree';
import { TalkOutLoud } from './TalkOutLoud';
import { TreeParseGUIState, DataToParse, ParseResponse, isErrorResponse, ParserInputProps } from '../TreeParseGUIState';
import { HighlightFunction, highlightFromAst } from './codeSubmission/highlightCode';
import * as _ from "lodash";
import { AppBar, Typography } from '@material-ui/core/';
import { ErrorDisplay } from './ErrorDisplay';
import * as MicrogrammarInput from './MicrogrammarInput';

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
      parserInput: {
        code: "blah<other><thing> haha",
        parserKind: "microgrammar",
        microgrammarInput: MicrogrammarInput.init,
        pathExpression: {
          microgrammar: MicrogrammarInput.initialPathExpression,
          Java9: "/compilationUnit",
          Markdown: "/root/*"
        },
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
    const parserKind = this.state.parserInput.parserKind;
    const parserSpec = parserKind === "microgrammar" ?
      MicrogrammarInput.parserSpec(
        this.state.parserInput.parserKind,
        this.state.parserInput.microgrammarInput) : { kind: parserKind };
    const dataToParse: DataToParse = {
      parser: parserSpec,
      code: this.state.parserInput.code,
      pathExpression: this.state.parserInput.pathExpression[parserKind],
    }
    const parseResponse = await getTree(dataToParse);
    if (isErrorResponse(parseResponse)) {
      return this.setState({ ast: [], error: parseResponse });
    }
    return this.setState({ ast: parseResponse.ast, error: undefined })
  }, 500);

  handleParserInputChange = async (data: ParserInputProps) => {
    console.log("in handleParserInputChange. data: ", data);
    this.setState(s => ({ parserInput: _.merge(s.parserInput, data), ast: [] }))
    this.updateTree();
  }

  highlightFn: HighlightFunction = (lineFrom0: number, charFrom0: number) =>
    highlightFromAst(this.state.parserInput.code, this.state.ast, lineFrom0, charFrom0);

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

    const treeChoice = {
      treeToRender: this.state.ast,
      theme: Theme.normal
    };


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
            <ErrorDisplay possibleError={this.state.error} />
            <ParserInput
              parserInput={this.state.parserInput}
              updateFn={this.handleParserInputChange}
              highlightFn={this.highlightFn}
              errorResponse={this.state.error}
            />
          </div>
          <Tree
            treeToRender={treeChoice.treeToRender}
            theme={treeChoice.theme} />
        </div>
        <p style={{ color: "white" }}>Working with @atomist/antlr version: {this.state.deps["@atomist/antlr"]}</p>
      </div>
    );
  }
}

async function getTree(dataToParse: DataToParse): Promise<ParseResponse> {
  try {
    const response = await fetch('/parse', {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(dataToParse), // body data type must match "Content-Type" header
    });
    const json = await response.json();
    return json as ParseResponse;
  } catch (e) {
    return { error: { message: e.message } }
  }
}
