import React from 'react';
import { EssayForm } from './EssayForm';

/* the main page for the index route of this app */
class HelloWorld extends React.Component<{}, { deps: string[] }> {

  constructor(props) {
    super(props);
    this.state = {
      deps: []
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

  render() {
    return (
      <div>
        <h1>Parse My Code!</h1>

        <p>Working with @atomist/antlr version: {this.state.deps["@atomist/antlr"]}</p>

        <EssayForm />
      </div>
    );
  }
}

module.exports = HelloWorld;