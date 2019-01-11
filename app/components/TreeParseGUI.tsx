import React from 'react';
import { Submit } from './codeSubmission/submit';
import { CodeDisplay } from './codeSubmission/codeDisplay';
import { Tree } from './jsonDisplay/tree';
import { TalkOutLoud } from './TalkOutLoud';
import { TreeParseGUIState } from '../TreeParseGUIState';
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
setSelectedWordsAndRanges = (words, ranges) => {
  this.setState({selectedWords: words, selectedRanges: ranges})
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
          <img src="https://atomist.com/img/Atomist-Logo-White-Horiz.png" style={{width: '15%', height: '50%'}}></img>
        </AppBar>
        <div style={{ display: "flex"}}>
          <div className="code-view">
              <Submit
                handleCodeSubmit={this.handleCodeSubmit}
                setSelectedWordsAndRanges={this.setSelectedWordsAndRanges}
              />
          </div>
          <Tree
            dataToParse={this.state.dataToParse} />
        </div>
        <p style={{color: "white"}}>Working with @atomist/antlr version: {this.state.deps["@atomist/antlr"]}</p>
      </div>
    );
  }
}