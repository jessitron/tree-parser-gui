import { PatternMatch } from "@atomist/microgrammar/lib/PatternMatch";
import { TreeNode } from "@atomist/tree-path";

export type ParserKind = "Java9" | "Markdown" | "microgrammar";
export type ParserSpec = MicrogrammarParserSpec | { kind: "Java9" | "Markdown" }


export type MicrogrammarParserSpec = {
    kind: "microgrammar",
    microgrammarString: string,
    matchName: string,
    rootName: string,
}

type HasPathExpression = {
    pathExpression: string,
}

export type DataToParse = {
    code: string,
    parser: ParserSpec,
} & HasPathExpression;


export type AST = TreeNode[];

export type TreeParseGUIState =
    {
        deps: string[],
        selectedWords: string[],
        selectedRanges: object[],
        displayCode: boolean,
        ast: AST,
        error?: ErrorResponse,
        parserInput: {
            parserKind: ParserKind;
            microgrammarInput: {
                matchName: string,
                rootName: string,
                microgrammarString: string,
            }
            pathExpression: { [K in ParserKind]: string },
            code: string
        }
    }

export type ErrorResponse = { error: { message: string } };
export type ParseResponse = { ast: AST } | ErrorResponse;

export function isErrorResponse(pr: ParseResponse): pr is ErrorResponse {
    const maybe = pr as ErrorResponse;
    return !!maybe.error;
}
