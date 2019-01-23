import React from 'react';
import { Radio, FormControlLabel, FormControl, FormLabel, RadioGroup } from "@material-ui/core";
import { CodeDisplay } from './codeDisplay';
import { ParserInputProps, PathExpressionByParserKind, ErrorResponse } from '../../TreeParseGUIState';
import { HighlightFunction } from './highlightCode';
import { MicrogrammarInput, MicrogrammarInputProps } from '../MicrogrammarInput';
import { PathExpressionInput } from '../PathExpressionInput';


export type AllParserInputProps = {
  parserInput: ParserInputProps,
  highlightFn: HighlightFunction,
  errorResponse?: ErrorResponse,
  updateFn: (dtp: Partial<ParserInputProps>) => Promise<void>,
}

const availableParsers = [{ value: "Java9", label: "Java" },
{ value: "Markdown", label: "Markdown" },
{ value: "microgrammar", label: "Microgrammar" },
];

export class ParserInput extends React.Component<AllParserInputProps, {}> {
  constructor(props) {
    super(props);
  }

  handleCodeChange = (code: string) => {
    this.props.updateFn({ code })
  }

  handleParserChoiceChange = (event, parserChoice) => {
    this.props.updateFn({ parserKind: parserChoice })
  }

  handleMicrogrammarChange = (microgrammarInput: MicrogrammarInputProps) => {
    return this.props.updateFn({
      microgrammarInput
    });
  }

  handlePathExpressionChange = (pathExpression: string) => {
    const pxe: Partial<PathExpressionByParserKind> = {};
    pxe[this.props.parserInput.parserKind] = pathExpression;
    return this.props.updateFn({
      pathExpression: pxe
    } as any)
  }

  handleSubmit = (event) => {
    console.log('You pushed submit.');
    event.preventDefault();
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
                value={this.props.parserInput.parserKind}
                onChange={this.handleParserChoiceChange}>
                {this.radioInputs("parserChoice", availableParsers)}
              </RadioGroup>
            </FormControl>
            <MicrogrammarInput parserKind={this.props.parserInput.parserKind}
              microgrammarInputProps={this.props.parserInput.microgrammarInput}
              handleChange={this.handleMicrogrammarChange}
              errorResponse={this.props.errorResponse} />
            <PathExpressionInput
              pathExpression={this.props.parserInput.pathExpression[
                this.props.parserInput.parserKind]}
              handlePathExpressionChange={this.handlePathExpressionChange} />
            Parse This:
            <CodeDisplay
              key="parseThisInput"
              highlightFn={this.props.highlightFn}
              className="parseThisInput"
              code={this.props.parserInput.code}
              handleCodeChange={this.handleCodeChange}
            />
          </form>
        </div>
      </div>
    );
  }
}