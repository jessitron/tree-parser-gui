import React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/theme/material.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/javascript/javascript.js';

export class CodeDisplay extends React.Component<{
    dataToParse: {
        code: string, 
        parserChoice: string,
    },
    handleCodeChange: any
    }, {}> {
    constructor(props) {
      super(props);
    }

    updateCode = (newCode) => {
        this.props.handleCodeChange(newCode);
    }

    render() {
    const options = {
      lineNumbers: true,
      readOnly: false,
      autoRefresh: true,
      autoSave: true,
      mode: 'clike',
      theme: 'material'
    };
        return(
            <CodeMirror
                value={this.props.dataToParse.code}
                options={options}
                onBeforeChange={(editor, data, value) => {
                    //@ts-ignore
                    value=this.updateCode(value)
                }}
                onChange={(editor, data, value) => {
                    // @ts-ignore
                    value=this.updateCode(value);
                }}
            />
        );
    }
}