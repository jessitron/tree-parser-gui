// credit: https://codepen.io/austinlyons/pen/ZLEKgN

import React from 'react';
import {Button, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel} from "@material-ui/core";
import {CodeDisplay} from './codeDisplay';

enum AvailableParsers {
  Java9 = "Java9",
  Markdown = "Markdown",
}

const availableParsers = [{ value: AvailableParsers.Java9, label: "Java" },
{ value: AvailableParsers.Markdown, label: "Markdown" }];

export class Submit extends React.Component<{ handleCodeSubmit: any, setSelectedWordsAndRanges: any }, {
  code: string,
  parserChoice: AvailableParsers
}> {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      parserChoice: availableParsers[0].value,
    };
  }

  handleCodeChange = (code) => {
    this.setState({...this.state, code});
  }

  handleParserChoiceChange = (event) => {
    this.setState({ ...this.state, parserChoice: event.target.value })
  }

  handleSubmit = (event) => {
    console.log('code was submitted: ' + this.state.code);
    event.preventDefault();
    const data = { code: this.state.code, parserChoice: this.state.parserChoice };
    this.props.handleCodeSubmit(data);
  }

  //this lifts words and their ranges (line numbers and beginning/ending characters)
  getSelectedWordsAndRanges = (cm, ranges) => {
    const words = cm.editor.doc.getSelections()
    this.props.setSelectedWordsAndRanges(words, ranges)
  }

  hasRange(ranges) {
      return !(ranges.length > 0 && ranges[0].anchor.ch === ranges[0].head.ch && ranges[0].anchor.line === ranges[0].head.line)
  }

  radioInputs(name, valueAndLabelses) {
    const oneInput = (value, label) => {
      return <FormControlLabel value={value} name={name} control={<Radio color="primary" />} label={label} color="white"/>
    }
    return valueAndLabelses.map(o => oneInput(o.value, o.label));
  }

  render() {
    return (
      <div>
        <div className="essayForm"
          style={{width: "100%", backgroundColor: "'#172330'"}}>
          <form 
            style={{backgroundColor: '#172330'}}
            onSubmit={this.handleSubmit}
          >
            <FormControl>
              <FormLabel component="legend">Choose A Parser</FormLabel>
                <RadioGroup
                value={this.state.parserChoice}
                onChange={this.handleParserChoiceChange}>
                  {this.radioInputs("parserChoice", availableParsers)}
                </RadioGroup>
            </FormControl>
            <CodeDisplay
              dataToParse={{ code: this.state.code, parserChoice: this.state.parserChoice }}
              handleCodeChange={this.handleCodeChange}
              getSelectedWordsAndRanges={this.getSelectedWordsAndRanges}
            />
            <Button 
              style={{margin: "1em"}}
              variant="contained" 
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    );
  }

}