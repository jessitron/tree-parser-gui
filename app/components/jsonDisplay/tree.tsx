import React from 'react';
import ReactJson from 'react-json-view';
import { AST, ErrorResponse } from '../../TreeParseGUIState';
import _ from 'lodash';

export class Tree extends React.Component<{ ast: AST, error?: ErrorResponse }, {}>{
    constructor(props) {
        super(props);
    }

    isAstPopulated() {
        return this.props.ast && this.props.ast.length > 0
    }

    isErrorTreePopulated() {
        return !!_.get(this.props, "error.error.tree")
    }

    treeToRender() {
        if (this.isAstPopulated()) {
            return this.props.ast;
        }
        if (this.isErrorTreePopulated()) {
            return this.props.error.error.tree;
        }
        return [];
    }

    theme() {
        if (this.isAstPopulated()) {
            return "apathy";
        } else if (this.isErrorTreePopulated()) {
            return "apathy:inverted";
        }
        return "apathy";
    }

    render() {
        return (
            <div className="preview"
                style={{ width: "50%" }}>
                <ReactJson
                    src={this.treeToRender()}
                    theme={this.theme()}
                    displayDataTypes={false}
                    enableClipboard={false}
                    onSelect={(select) => console.log("Selected: " + JSON.stringify(select))}
                />
            </div>
        );
    }
}
// TODO next: just try it jess and see if it renders an error tree