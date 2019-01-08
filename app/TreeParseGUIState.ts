export type DataToParse = {
    code: string,
    microgrammarString: string,
}


export type AST = object;

export type TreeParseGUIState =
    {
        deps: string[],
        selectedWords: string[],
        selectedRanges: object[],
        displayCode: boolean,
        dataToParse: DataToParse,
        ast: object
    }
