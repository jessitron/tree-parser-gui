import React from 'react';
import ReactJson from 'react-json-view';

const startingTree = { name: "compilationUnit" };

//TODO do I need these in this component?
// enum AvailableParsers {
//   Java9 = "Java9",
//   Markdown = "Markdown",
// }

// const availableParsers = [{ value: AvailableParsers.Java9, label: "Java" },
// { value: AvailableParsers.Markdown, label: "Markdown" }];

export class Tree extends React.Component<{dataToParse: object},{
    // code: string,
    // parserChoice: AvailableParsers,
    ast: any,
}>{
    constructor(props) {
        super(props);
        this.state = {
            ast: startingTree
        }
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.dataToParse !== nextProps.dataToParse){
            this.getTree(nextProps.dataToParse)
        }
    }
    getTree(dataToParse) {
        return fetch('/parse', {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(dataToParse), // body data type must match "Content-Type" header
          })
            .then(response => response.json())
            // parses response to JSON
            .then(j => this.setState({ ...this.state, ast: j.ast }))
            .catch(error => console.error(error));
    }
    renderTree (tree) {
        return JSON.stringify(tree);
      }
    render() {
        return(
            <div className="preview"
                style={{width: "50%"}}>
          <ReactJson 
            src={this.state.ast}
            theme="apathy"
            displayDataTypes={false}
            onSelect={(select) => console.log("Selected: " + JSON.stringify(select))}
          />
        </div>
        );
    }
}