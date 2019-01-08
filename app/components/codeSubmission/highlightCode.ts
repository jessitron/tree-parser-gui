import { AST } from "../../TreeParseGUIState";

export type HighlightFunction = () => any

export function highlightFn(ast: AST): HighlightFunction {
    return () => {
        console.log("This is the highlight function");
        return null;
    }
}