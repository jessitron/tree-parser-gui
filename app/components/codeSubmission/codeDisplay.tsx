import React from 'react';
import { Controlled as CodeMirror, IDefineModeOptions } from 'react-codemirror2'
import 'codemirror/theme/material.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/addon/selection/mark-selection.js'

export class CodeDisplay extends React.Component<{
    dataToParse: {
        code: string,
    },
    className?: string,
    handleCodeChange: any
}, { selectedRanges: any }> {
    constructor(props) {
        super(props);
        this.state = {
            selectedRanges: null
        }
    }

    updateCode = (newCode) => {
        this.props.handleCodeChange(newCode);
    }

    updateSelectedRanges = (selectedRanges: any) => {
        this.setState({ ...this.state, selectedRanges })
    }

    //this works for the first selection, but not multiple
    hasRange(ranges) {
        return !(ranges.length > 0 && ranges[0].anchor.ch === ranges[0].head.ch && ranges[0].anchor.line === ranges[0].head.line)
    }

    render() {
        const options = {
            lineNumbers: true,
            readOnly: false,
            autoRefresh: true,
            autoSave: true,
            mode: "text/plain",
            theme: 'material'
        }

        const plainMode: IDefineModeOptions = {
            name: "text",
            fn: () => {
                return {
                    token: () => { return null; }
                }
            }
        };

        return (
            <CodeMirror
                className={this.props.className}
                //@ts-ignore
                ref={(c: any) => this.cm = c}
                value={this.props.dataToParse.code}
                options={options}
                //   defineMode={plainMode}
                onBeforeChange={(editor, data, value) => {
                    //@ts-ignore
                    value = this.updateCode(value)
                }}
                onChange={(editor, data, value) => {
                    // @ts-ignore
                    value = this.updateCode(value);
                }}
                onSelection={(editor, data) => {
                    this.updateSelectedRanges(data.ranges)
                    // @ts-ignore
                }}
            />
        );
    }
}