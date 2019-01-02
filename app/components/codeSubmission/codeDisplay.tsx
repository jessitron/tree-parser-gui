import React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/theme/material.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/addon/selection/mark-selection.js'

enum ParserToMimeType {
    Java9 = "clike",
    Markdown = "GFM",
  }

export class CodeDisplay extends React.Component<{
    dataToParse: {
        code: string, 
        parserChoice: string,
    },
    handleCodeChange: any
    getSelectedWordsAndRanges: any
    }, {selectedRanges: any}> {
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
        this.setState({...this.state, selectedRanges})
    }

    // right now this is weirdly triggered onKeyDown, but ... yeah
    getSelectedWords = () => {
        if(this.hasRange(this.state.selectedRanges)) {
        // @ts-ignore
        this.props.getSelectedWordsAndRanges(this.cm, this.state.selectedRanges)
        }
      }
      //this works for the first selection, but not multiple
      hasRange(ranges) {
          return !(ranges.length > 0 && ranges[0].anchor.ch === ranges[0].head.ch && ranges[0].anchor.line === ranges[0].head.line)
      }

    render() {
    const mimeType = ParserToMimeType[this.props.dataToParse.parserChoice];
    const options = {
      lineNumbers: true,
      readOnly: false,
      autoRefresh: true,
      autoSave: true,
      mode: mimeType,
      theme: 'material'
    }
    
        return(
            <CodeMirror
                //@ts-ignore
                ref={(c: any) => this.cm = c}
                value={this.props.dataToParse.code}
                options={options}
                onKeyDown={this.getSelectedWords}
                onBeforeChange={(editor, data, value) => {
                    //@ts-ignore
                    value=this.updateCode(value)
                }}
                onChange={(editor, data, value) => {
                    // @ts-ignore
                    value=this.updateCode(value);
                }}
                onSelection={(editor, data) => {
                    this.updateSelectedRanges(data.ranges)
                    // @ts-ignore
                }}
            />
        );
    }
}