import _ from "lodash";
import React from "react";
import ReactJson, { ThemeKeys } from "react-json-view";

export class Tree extends React.Component<{ treeToRender: any, theme: ThemeKeys }, {}> {
    constructor(props) {
        super(props);
    }

    public theme(): string {
        return this.props.theme;
    }

    public render() {
        return (
            <ReactJson
                src={this.props.treeToRender}
                theme={this.theme() as any}
                displayDataTypes={false}
                enableClipboard={false}
                onSelect={(select) => console.log("Selected: " + JSON.stringify(select))}
            />
        );
    }
}
