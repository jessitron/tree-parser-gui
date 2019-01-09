import { Controlled as CodeMirror, IDefineModeOptions } from 'react-codemirror2'
import 'codemirror/theme/material.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/addon/selection/mark-selection.js'
import { HighlightFunction, areWeDone } from './highlightCode';
import { StringStream } from 'codemirror';
import React from 'react';

export type CodeDisplayProps = {
    code: string,
    className?: string,
    handleCodeChange: (newCode: string) => void,
    highlightFn?: HighlightFunction
}

export class CodeDisplay extends React.Component<CodeDisplayProps, { selectedRanges: any }> {
    constructor(props) {
        super(props);
        console.log("I am a code display with class " + props.className)
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
            mode: this.props.highlightFn ? "yourMicrogrammar" : "text/plain",
            theme: 'material'
        }

        return (
            <CodeMirror
                className={this.props.className}
                //@ts-ignore
                ref={(c: any) => this.cm = c}
                value={this.props.code}
                options={options}
                defineMode={customMode(this.props.className, this.props.highlightFn)}
                onBeforeChange={(editor, data, value) => {
                    //@ts-ignore
                    // value =
                    this.updateCode(value) // wtf why are we setting it to void
                }}
                onSelection={(editor, data) => {
                    this.updateSelectedRanges(data.ranges)
                    // @ts-ignore
                }}
            />
        );
    }
}

function customMode(className: string, highlightFn?: HighlightFunction): IDefineModeOptions {
    if (!highlightFn) {
        console.log("Returning plain microgrammar for " + className);
        return plainMode;
    }
    console.log("Returning special customMode for " + className);
    return {
        name: "yourMicrogrammar",
        fn: () => {
            return {
                token: (stream: StringStream) => {
                    console.log("pos:" + JSON.stringify(stream.pos));
                    const highlightAdvice = highlightFn(stream.pos);

                    if (areWeDone(highlightAdvice)) {
                        console.log("Eating everything")
                        stream.eatWhile(() => true);
                        return null;
                    }
                    // advance the specified number of characters
                    console.log("Eating so many: " + highlightAdvice.eatChars)
                    for (let i = 0; i < highlightAdvice.eatChars; i++) {
                        stream.next();
                    }
                    return highlightAdvice.className;
                }
            }
        }
    }
}

const plainMode: IDefineModeOptions = {
    name: "plain",
    fn: () => {
        return {
            token: (stream) => { stream.eatWhile(() => true); return null; }
        }
    }
};