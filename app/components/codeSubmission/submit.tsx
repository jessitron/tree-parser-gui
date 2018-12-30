// credit: https://codepen.io/austinlyons/pen/ZLEKgN

import React from 'react';
import { TextField, Button, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from "@material-ui/core";

// const startingTree = { name: "compilationUnit" };

enum AvailableParsers {
  Java9 = "Java9",
  Markdown = "Markdown",
}

const availableParsers = [{ value: AvailableParsers.Java9, label: "Java" },
{ value: AvailableParsers.Markdown, label: "Markdown" }];

export class Submit extends React.Component<{ handleCodeSubmit: any }, {
  code: string,
  parserChoice: AvailableParsers,
}> {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      parserChoice: availableParsers[0].value,
    };
  }

  handleCodeChange = (event) => {
    this.setState({ ...this.state, code: event.target.value });
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
  radioInputs(name, valueAndLabelses) {
    const oneInput = (value, label) => {
      return <FormControlLabel value={value} name={name} control={<Radio />} label={label} />
    }
    return valueAndLabelses.map(o => oneInput(o.value, o.label));
  }

  render() {
    return (
      <div className="essayForm"
        style={{ width: "100%" }}>
        <form
          onSubmit={this.handleSubmit}
          style={{ backgroundColor: "#f0f0f0", width: "100%" }}
        >
          <FormControl>
            <FormLabel component="legend">Choose A Parser</FormLabel>
            <RadioGroup
              value={this.state.parserChoice}
              onChange={this.handleParserChoiceChange}>
              {this.radioInputs("parserChoice", availableParsers)}
            </RadioGroup>
          </FormControl>
          <TextField
            style={{ margin: "1em", width: "100%" }}
            label="Code To Parse"
            value={this.state.code}
            variant="outlined"
            onChange={this.handleCodeChange}
            multiline
            rows={15}
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
    );
  }

}