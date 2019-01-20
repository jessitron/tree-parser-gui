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

    handlePhraseChange = (microgrammarString: string) => {
        return this.props.handleChange({ microgrammarString });
    }

    handleTermsChange = (terms: string) => {
        return this.props.handleChange({ terms });
    }

    render() {
        if (this.props.parserKind !== "microgrammar") {
            return <div id="MicrogrammarInput" className="hidden" />;
        }
        return <div id="microgrammarInput">
            Microgrammar phrase:
           <CodeDisplay
                key="microgrammarInput"
                code={this.props.microgrammarInputProps.microgrammarString}
                handleCodeChange={this.handlePhraseChange}
                className="microgrammarInput" />
            Microgrammar terms:
           <CodeDisplay
                key="termInput"
                code={this.props.microgrammarInputProps.terms}
                handleCodeChange={this.handleTermsChange}
                className="microgrammarInput" />
        </div>
    }
};

export type MicrogrammarInputProps = {
    microgrammarString: string,
    terms: string,
    matchName: string,
    rootName: string,
};

export const init: MicrogrammarInputProps = {
    microgrammarString: "<${first}><${second}>",
    matchName: "mg",
    rootName: "root",
    terms: `{
    first: /[a-zA-Z0-9]+/,
    second: /[a-zA-Z0-9]+/
}`

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