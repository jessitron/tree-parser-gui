export type TreeParseGUIState =
    {
        deps: string[],
        selectedWords: string[],
        selectedRanges: object[],
        displayCode: boolean,
        dataToParse: {
            code: string,
            parserChoice: string
        },
    }
