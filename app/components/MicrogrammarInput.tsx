import { CodeDisplay } from "./codeSubmission/codeDisplay";
import React from "react";
import { ParserSpec } from "../TreeParseGUIState";

export class MicrogrammarInput extends React.Component<{
    parser: ParserSpec,
    handleMicrogrammarChange: (s: string) => Promise<void>
}, { savedMicrogrammar: string }> {

    constructor(props) {
        super(props);
        this.state = { savedMicrogrammar: props.parser.microgrammarString }
    }

    handleMicrogrammarChange = (microgrammarString: string) => {
        this.setState({ savedMicrogrammar: microgrammarString })
        return this.props.handleMicrogrammarChange(microgrammarString);
    }

    render() {
        if (this.props.parser.kind !== "microgrammar") {
            return <div id="MicrogrammarInput" className="hidden" />;
        }
        return <div id="microgrammarInput">
            Microgrammar:
           <CodeDisplay
                key="microgrammarInput"
                code={this.state.savedMicrogrammar}
                handleCodeChange={this.props.handleMicrogrammarChange}
                className="microgrammarInput" />
        </div>
    }
};