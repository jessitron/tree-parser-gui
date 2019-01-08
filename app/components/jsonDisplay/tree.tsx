import React from 'react';
import ReactJson from 'react-json-view';
import { AST } from '../../TreeParseGUIState';

export class Tree extends React.Component<{ ast: AST }, {}>{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="preview"
                style={{ width: "50%" }}>
                <ReactJson
                    src={this.props.ast}
                    theme="apathy"
                    displayDataTypes={false}
                    onSelect={(select) => console.log("Selected: " + JSON.stringify(select))}
                />
            </div>
        );
    }
}