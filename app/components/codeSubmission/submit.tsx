// credit: https://codepen.io/austinlyons/pen/ZLEKgN

import React from 'react';
import { Radio, FormControlLabel, FormControl, FormLabel, RadioGroup } from "@material-ui/core";
import { CodeDisplay } from './codeDisplay';
import { DataToParse } from '../../TreeParseGUIState';
import { HighlightFunction } from './highlightCode';
import { MicrogrammarInput } from '../MicrogrammarInput';
import { PathExpressionInput } from '../PathExpressionInput';


export type SubmitProps = {
  dataToParse: DataToParse,
  highlightFn: HighlightFunction,
  dataToParseUpdateFn: (dtp: Partial<DataToParse>) => Promise<void>,
  setSelectedWordsAndRanges: any
}

const availableParsers = [{ value: "Java9", label: "Java" },
{ value: "Markdown", label: "Markdown" },
{ value: "microgrammar", label: "Microgrammar" },
];

export class Submit extends React.Component<SubmitProps, {}> {
  constructor(props) {
    super(props);
  }

  handleCodeChange = (code) => {
    this.props.dataToParseUpdateFn({ code })
  }

  handleParserChoiceChange = (event, parserChoice) => {
    // TODO: populate mg bits?
    this.props.dataToParseUpdateFn({ parser: { kind: parserChoice } })
  }

  handleMicrogrammarChange = (microgrammarString) => {
    return this.props.dataToParseUpdateFn({
      parser: {
        kind: "microgrammar",
        microgrammarString,
        matchName: "mg",
        rootName: "root",
      }
    });
  }

  handlePathExpressionChange = (pathExpression) => {
    return this.props.dataToParseUpdateFn({
      pathExpression
    })
  }

  handleSubmit = (event) => {
    console.log('You pushed submit.');
    event.preventDefault();
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
      return <FormControlLabel
        value={value} name={name}
        control={<Radio color="primary" />}
        label={label}
        color="white"
        key={value} />
    }
    return valueAndLabelses.map(o => oneInput(o.value, o.label));
  }

  render() {
    const parser = this.props.dataToParse.parser;

    return (
      <div>
        <div className="essayForm"
          style={{ width: "100%", backgroundColor: "'#172330'" }}>
          <form
            style={{ backgroundColor: '#172330' }}
            onSubmit={this.handleSubmit}
          >
            <FormControl>
              <FormLabel component="legend">Choose A Parser</FormLabel>
              <RadioGroup
                key="parser-choice"
                value={parser.kind}
                onChange={this.handleParserChoiceChange}>
                {this.radioInputs("parserChoice", availableParsers)}
              </RadioGroup>
            </FormControl>
            <MicrogrammarInput parser={parser}
              handleMicrogrammarChange={this.handleMicrogrammarChange} />
            <PathExpressionInput
              pathExpression={this.props.dataToParse.pathExpression}
              handlePathExpressionChange={this.handlePathExpressionChange} />
            Parse This:
            <CodeDisplay
              key="parseThisInput"
              highlightFn={this.props.highlightFn}
              className="parseThisInput"
              code={this.props.dataToParse.code}
              handleCodeChange={this.handleCodeChange}
            />
          </form>
        </div>
      </div>
    );
  }

}