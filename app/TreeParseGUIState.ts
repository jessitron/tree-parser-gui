import { PatternMatch } from "@atomist/microgrammar/lib/PatternMatch";

export type DataToParse = {
    code: string,
    microgrammarString: string,
}


export type AST = PatternMatch[];

export type TreeParseGUIState =
    {
        deps: string[],
        selectedWords: string[],
        selectedRanges: object[],
        displayCode: boolean,
        dataToParse: DataToParse,
        ast: AST
    }
