import { CodeDisplay } from "./codeSubmission/codeDisplay";
import React from "react";
import { ParserSpec } from "../TreeParseGUIState";

export function MicrogrammarInput(props: {
    parser: ParserSpec,
    handleMicrogrammarChange: (s: string) => Promise<void>
}) {
    if (props.parser.kind !== "microgrammar") {
        return <div id="MicrogrammarInput" className="hidden" />;
    }
    return <div id="microgrammarInput">
        Microgrammar:
           <CodeDisplay
            key="microgrammarInput"
            code={props.parser.microgrammarString}
            handleCodeChange={props.handleMicrogrammarChange}
            className="microgrammarInput" />
    </div>
};