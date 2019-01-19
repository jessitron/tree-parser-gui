import { CodeDisplay } from "./codeSubmission/codeDisplay";
import React from "react";
import { ParserKind, MicrogrammarParserSpec } from "../TreeParseGUIState";

export class MicrogrammarInput extends React.Component<{
    parserKind: ParserKind,
    microgrammarInputProps: MicrogrammarInputProps
    handleChange: (mip: Partial<MicrogrammarInputProps>) => Promise<void>
}, {}> {

    constructor(props) {
        super(props);
    }

    handleMicrogrammarChange = (microgrammarString: string) => {
        this.setState({ savedMicrogrammar: microgrammarString })
        return this.props.handleChange({ microgrammarString });
    }

    render() {
        if (this.props.parserKind !== "microgrammar") {
            return <div id="MicrogrammarInput" className="hidden" />;
        }
        return <div id="microgrammarInput">
            Microgrammar:
           <CodeDisplay
                key="microgrammarInput"
                code={this.props.microgrammarInputProps.microgrammarString}
                handleCodeChange={this.handleMicrogrammarChange}
                className="microgrammarInput" />
        </div>
    }
};

export type MicrogrammarInputProps = {
    microgrammarString: string,
    matchName: string,
    rootName: string,
};

export const init: MicrogrammarInputProps = {
    microgrammarString: "<${first}><${second}>",
    matchName: "mg",
    rootName: "root"
};

export const initialPathExpression = "/root/mg";

export function parserSpec(
    parserKind: ParserKind,
    mip: MicrogrammarInputProps): MicrogrammarParserSpec | undefined {
    if (parserKind !== "microgrammar") {
        return undefined;
    }
    return {
        kind: "microgrammar",
        ...mip,
    }
}