import { Editor, Mode, StringStream } from "codemirror";
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/gfm/gfm.js";
import "codemirror/theme/material.css";
import React from "react";
import { Controlled as CodeMirror, IDefineModeOptions } from "react-codemirror2";
import { areWeDone, HighlightFunction } from "./highlightCode";

export interface CodeDisplayProps {
    code: string;
    className?: string;
    handleCodeChange: (newCode: string) => void;
    highlightFn?: HighlightFunction;
}

export class CodeDisplay extends React.Component<CodeDisplayProps, {}> {
    constructor(props) {
        super(props);
        console.log("I am a code display with class " + props.className);
    }

    private editor: Editor;
    private overlay?: Mode<any>;

    public updateCode = (newCode) => {
        this.props.handleCodeChange(newCode);
    }

    // this works for the first selection, but not multiple
    public hasRange(ranges) {
        return !(ranges.length > 0 &&
            ranges[0].anchor.ch === ranges[0].head.ch &&
            ranges[0].anchor.line === ranges[0].head.line);
    }

    public render() {
        const options = {
            lineNumbers: true,
            readOnly: false,
            autoRefresh: true,
            autoSave: true,
            mode: "text/plain",
            theme: "material",
        };

        if (this.editor && this.overlay) {
            this.editor.removeOverlay(this.overlay);
            this.overlay = null;
        }
        if (this.editor && this.props.highlightFn) {
            this.overlay = customMode(this.props.className, this.props.highlightFn);
            this.editor.addOverlay(this.overlay);
        }

        return (
            <CodeMirror
                className={this.props.className}
                editorDidMount={(editor) => { this.editor = editor; }}
                // @ts-ignore
                ref={(c: any) => this.cm = c}
                value={this.props.code}
                options={options}
                onBeforeChange={(editor, data, value) => {
                    this.updateCode(value);
                }}
            />
        );
    }
}

function customMode(className: string, highlightFn?: HighlightFunction): Mode<any> {
    if (!highlightFn) {
        console.log("Returning plain microgrammar for " + className);
        return plainMode;
    }
    console.log("Returning special customMode for " + className);
    return {
        token: (stream: StringStream) => {
            const startingPos = stream.pos;
            console.log("pos:" + JSON.stringify(stream.pos));
            const highlightAdvice = highlightFn((stream as any).lineOracle.line, stream.pos);

            if (areWeDone(highlightAdvice)) {
                console.log("Eating everything");
                stream.eatWhile(() => true);
                return null;
            }
            // advance the specified number of characters
            console.log("Eating so many: " + highlightAdvice.eatChars);
            for (let i = 0; i < highlightAdvice.eatChars; i++) {
                stream.next();
            }
            if (stream.pos === startingPos) {
                stream.next(); // always advance at least one
                return null; // but never highlight that sad one
            }
            return highlightAdvice.className;
        },
    };
}

const plainMode: Mode<any> = {
    token: (stream) => { stream.eatWhile(() => true); return null; },
};
