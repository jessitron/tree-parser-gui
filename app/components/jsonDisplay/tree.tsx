import React from 'react';
import ReactJson from 'react-json-view';
import _ from 'lodash';

export enum Theme {
    anger = "apathy: inverted",
    normal = "apathy",
}

export class Tree extends React.Component<{ treeToRender: any, theme?: Theme }, {}>{
    constructor(props) {
        super(props);
    }

    theme(): string {
        return this.props.theme || Theme.normal
    }

    render() {
        return (
            <div className="preview"
                style={{ width: "50%" }}>
                <ReactJson
                    src={this.props.treeToRender}
                    theme={this.theme() as any}
                    displayDataTypes={false}
                    enableClipboard={false}
                    onSelect={(select) => console.log("Selected: " + JSON.stringify(select))}
                />
            </div>
        );
    }
}
// TODO next: just try it jess and see if it renders an error tree