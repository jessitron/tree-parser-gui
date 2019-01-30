import { AST } from "../../TreeParseGUIState";

export type HighlightInstruction = SomeChars | WeAreDoneHere;

interface SomeChars { eatChars: number; className: string | null; }

type WeAreDoneHere = "we are done here";

export function areWeDone(hi: HighlightInstruction): hi is WeAreDoneHere {
    return hi === "we are done here";
}

export type HighlightFunction = (lineFrom0: number, charFrom0: number) => HighlightInstruction;

export function highlightFromAst(
    code: string,
    ast: AST,
    lineFrom0: number,
    charFrom0: number) {
    console.log("This is the highlight function");

    const offset = offsetInFile(code, lineFrom0, charFrom0);

    // I would rather do this once per update, but sad day.
    const highlightMatches = ast.map((match) => ({
        begin: match.$offset,
        length: match.$value.length,
    }));

    if (highlightMatches.length === 0) {
        return "we are done here";
    }

    const startingMatch = highlightMatches.find((m) => m.begin === offset);
    if (startingMatch) {
        return { eatChars: startingMatch.length, className: "match" };
    }
    const midMatch = highlightMatches.find((m) => m.begin < offset && offset < (m.begin + m.length));
    if (midMatch) {
        return { eatChars: midMatch.begin + midMatch.length - offset, className: "match" };
    }
    const nextMatch = highlightMatches.find((m) => m.begin > offset);
    if (nextMatch) {
        return { eatChars: nextMatch.begin - offset, className: null };
    }

    const lastMatch = highlightMatches[highlightMatches.length - 1];
    if (offset > (lastMatch.begin + lastMatch.length)) {
        return "we are done here";
    }
    console.log("Unexpected offset! " + offset);
    console.log("The matches I know are: " + JSON.stringify(highlightMatches));

    return "we are done here";
}

function offsetInFile(content: string, lineFrom0: number, charFrom0: number): number {
    if (lineFrom0 === 0) {
        return charFrom0;
    }
    const previousLines = content.split("\n").slice(0, lineFrom0).join("\n") + "\n";
    return previousLines.length + charFrom0;
}
