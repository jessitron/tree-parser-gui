import { PatternMatch } from "@atomist/microgrammar/lib/PatternMatch";
import { TreeNode } from "@atomist/tree-path";
import { MicrogrammarInputProps } from "./components/MicrogrammarInput";

export type ParserKind = "Java9" | "Markdown" | "microgrammar";
export type ParserSpec = MicrogrammarParserSpec | { kind: "Java9" | "Markdown" }


export type MicrogrammarParserSpec = {
    kind: "microgrammar",
    microgrammarString: string,
    matchName: string,
    rootName: string,
    terms: string,
}

type HasPathExpression = {
    pathExpression: string,
}

// server interface
export type DataToParse = {
    code: string,
    parser: ParserSpec,
} & HasPathExpression;

export type AST = TreeNode[];

export type PathExpressionByParserKind = { [K in ParserKind]: string };

export type ParserInputProps = {
    parserKind: ParserKind;
    microgrammarInput: MicrogrammarInputProps;
    pathExpression: PathExpressionByParserKind,
    code: string
}

export type TreeParseGUIState =
    {
        deps: string[],
        selectedWords: string[],
        selectedRanges: object[],
        displayCode: boolean,
        ast: AST,
        error?: ErrorResponse,
        parserInput: ParserInputProps,
    }

export type ErrorResponse = { error: { message: string } };
export type ParseResponse = { ast: AST } | ErrorResponse;

export function isErrorResponse(pr: ParseResponse): pr is ErrorResponse {
    const maybe = pr as ErrorResponse;
    return !!maybe.error;
}
