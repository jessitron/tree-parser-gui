import { AST } from "../../TreeParseGUIState";

export type HighlightInstruction = SomeChars | WeAreDoneHere

type SomeChars = { eatChars: number, className: string | null }

type WeAreDoneHere = "we are done here";

export function areWeDone(hi: HighlightInstruction): hi is WeAreDoneHere {
    return hi === "we are done here";
}

export type HighlightFunction = (offset: number) => HighlightInstruction

export function highlightFn(ast: AST): HighlightFunction {
    console.log("Calculating new highlight fn. The AST has some: " + ast.length);
    const highlightMatches = ast.map(match => ({
        begin: match.$offset,
        length: length,
    }));

    if (highlightMatches.length === 0) {
        return () => "we are done here";
    }

    return (offset: number) => {
        console.log("This is the highlight function");

        if (offset === 0) {
            return {
                eatChars: highlightMatches[0].begin,
                className: null,
            }
        }
        const thisOne = highlightMatches.find(m => m.begin === offset);
        if (thisOne) {
            return { eatChars: thisOne.length, className: "match" }
        }
        const lastMatch = highlightMatches[highlightMatches.length - 1];
        if (offset > (lastMatch.begin + lastMatch.length)) {
            return "we are done here";
        }
        console.log("Unexpected offset! " + offset);
        console.log("The matches I know are: " + JSON.stringify(highlightMatches));

        return "we are done here";
    }
}