import { AST } from "../../TreeParseGUIState";

export type HighlightInstruction = SomeChars | WeAreDoneHere

type SomeChars = { eatChars: number, className: string | null }

type WeAreDoneHere = "we are done here";

export function areWeDone(hi: HighlightInstruction): hi is WeAreDoneHere {
    return hi === "we are done here";
}

export type HighlightFunction = (offset: number) => HighlightInstruction

export function highlightFromAst(ast: AST, offset: number) {
    console.log("This is the highlight function");

    // I would rather do this once per update, but sad day.
    const highlightMatches = ast.map(match => ({
        begin: match.$offset,
        length: match.$matched.length,
    }));

    if (highlightMatches.length === 0) {
        return "we are done here";
    }

    const startingMatch = highlightMatches.find(m => m.begin === offset);
    if (startingMatch) {
        return { eatChars: startingMatch.length, className: "match" }
    }
    const nextMatch = highlightMatches.find(m => m.begin > offset);
    if (nextMatch) {
        return { eatChars: nextMatch.begin - offset, className: null }
    }

    const lastMatch = highlightMatches[highlightMatches.length - 1];
    if (offset > (lastMatch.begin + lastMatch.length)) {
        return "we are done here";
    }
    console.log("Unexpected offset! " + offset);
    console.log("The matches I know are: " + JSON.stringify(highlightMatches));

    return "we are done here";
}
