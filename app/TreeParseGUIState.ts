import { TreeNode } from "@atomist/tree-path";

export type ParserKind = "Java9" | "Markdown";
export type ParserSpec = { kind: "Java9" | "Markdown" };

interface HasPathExpression {
    pathExpression: string;
}

// server interface
export type DataToParse = {
    code: string,
    parser: ParserSpec,
} & HasPathExpression;

export type AST = TreeNode[];

export type PathExpressionByParserKind = { [K in ParserKind]: string };

export interface ParserInputProps {
    parserKind: ParserKind;
    pathExpression: PathExpressionByParserKind;
    code: string;
}

export interface TreeParseGUIState {
    deps: string[];
    selectedWords: string[];
    selectedRanges: object[];
    displayCode: boolean;
    ast: AST;
    error?: ErrorResponse;
    parserInput: ParserInputProps;
    chosenTree: TreeChoices;
}

export enum TreeChoices {
    ast = "parseThis",
    parsingError = "error",
}

export interface ErrorResponse {
    error: {
        message: string,
        complainAbout?: KnownErrorLocation,
        tree?: TreeNode,
    };
}

export type KnownErrorLocation = "path expression" | "code parse";

export type ParseResponse = { ast: AST } | ErrorResponse;

export function isErrorResponse(pr: ParseResponse): pr is ErrorResponse {
    const maybe = pr as ErrorResponse;
    return !!maybe.error;
}
