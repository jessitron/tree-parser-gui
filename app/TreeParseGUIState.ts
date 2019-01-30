import { PatternMatch } from "@atomist/microgrammar/lib/PatternMatch";
import { TreeNode } from "@atomist/tree-path";
import { MicrogrammarInputProps } from "./components/MicrogrammarInput";

export type ParserKind = "Java9" | "Markdown" | "microgrammar";
export type ParserSpec = MicrogrammarParserSpec | { kind: "Java9" | "Markdown" };

export interface MicrogrammarParserSpec {
    kind: "microgrammar";
    microgrammarString: string;
    matchName: string;
    rootName: string;
    terms: string;
}

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
    microgrammarInput: MicrogrammarInputProps;
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
        treeToDisplay: TreeChoices;
    }

export enum TreeChoices {
    ast = "parseThis",
    // goal: microgrammarTerms = "mgTerms",
    parsingError = "error",
}

export interface ErrorResponse {
    error: {
        message: string,
        complainAbout?: KnownErrorLocation,
        tree?: TreeNode,
    };
}

export type KnownErrorLocation = "path expression" | "code parse" | "microgrammar terms";

export type ParseResponse = { ast: AST } | ErrorResponse;

export function isErrorResponse(pr: ParseResponse): pr is ErrorResponse {
    const maybe = pr as ErrorResponse;
    return !!maybe.error;
}
