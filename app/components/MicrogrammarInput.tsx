import { CodeDisplay } from "./codeSubmission/codeDisplay";
import React from "react";
import { ParserKind, MicrogrammarParserSpec, ErrorResponse, KnownErrorLocation } from "../TreeParseGUIState";

export class MicrogrammarInput extends React.Component<{
    parserKind: ParserKind,
    microgrammarInputProps: MicrogrammarInputProps,
    errorResponse?: ErrorResponse,
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
                className="microgrammarInput can-have-errors"
            />
            {this.errorDisplay("microgrammar terms", this.props.errorResponse)}
        </div>
    }

    errorDisplay(location: KnownErrorLocation, errorResponse: ErrorResponse | undefined) {
        const key = "error-" + location
        const emptyDiv = <div className="hidden" key={key} />;
        if (!errorResponse || !errorResponse.error) {
            console.log("No error");
            return emptyDiv;
        }
        if (errorResponse.error.complainAbout !== location) {
            console.log("Error in wrong place" + errorResponse.error.complainAbout)
            return emptyDiv;
        }

        return <div key={key} className="error-display">{errorResponse.error.message}</div>
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