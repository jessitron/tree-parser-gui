import { PatternMatch } from "@atomist/microgrammar/lib/PatternMatch";
import { TreeNode } from "@atomist/tree-path";

export type ParserSpec = MicrogrammarParserSpec | { kind: "Java9" } | { kind: "Markdown" }

export type MicrogrammarParserSpec = {
    kind: "microgrammar",
    microgrammarString: string,
    matchName: string,
    rootName: string,
}

export type DataToParse = {
    code: string,
    parser: ParserSpec,
    pathExpression: string,
}


export type AST = TreeNode[];

export type TreeParseGUIState =
    {
        deps: string[],
        selectedWords: string[],
        selectedRanges: object[],
        displayCode: boolean,
        dataToParse: DataToParse,
        ast: AST,
        error?: ErrorResponse
    }

export type ErrorResponse = { error: { message: string } };
export type ParseResponse = { ast: AST } | ErrorResponse;

export function isErrorResponse(pr: ParseResponse): pr is ErrorResponse {
    const maybe = pr as ErrorResponse;
    return !!maybe.error;
}
