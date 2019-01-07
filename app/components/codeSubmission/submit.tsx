// credit: https://codepen.io/austinlyons/pen/ZLEKgN

import React from 'react';
import { Button, Radio, FormControlLabel } from "@material-ui/core";
import { CodeDisplay } from './codeDisplay';

export type SubmitState = {
  code: string,
  microgrammarString: string,
}

export class Submit extends React.Component<{
  handleCodeSubmit: any,
  setSelectedWordsAndRanges: any
}, SubmitState> {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      microgrammarString: "<$first><$second>",
    };
  }

  handleCodeChange = (code) => {
    this.setState({ ...this.state, code });
  }

  handleMicrogrammarChange = (microgrammarString) => {
    this.setState({ ...this.state, microgrammarString })
  }

  handleSubmit = (event) => {
    console.log('code was submitted: ' + this.state.code);
    event.preventDefault();
    const data = { code: this.state.code };
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
      return <FormControlLabel value={value} name={name} control={<Radio />} label={label} />
    }
    return valueAndLabelses.map(o => oneInput(o.value, o.label));
  }

  render() {
    return (
      <div>
        <div className="essayForm"
          style={{ width: "100%" }}>
          <form
            onSubmit={this.handleSubmit}
          >
            Microgrammar:
            <CodeDisplay
              dataToParse={{ code: this.state.microgrammarString }}
              handleCodeChange={this.handleMicrogrammarChange}
            />
            Parse This:
            <CodeDisplay
              dataToParse={{ code: this.state.code }}
              handleCodeChange={this.handleCodeChange}
            />
            <Button
              style={{ margin: "1em" }}
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