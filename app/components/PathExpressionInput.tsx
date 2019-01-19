import { CodeDisplay } from "./codeSubmission/codeDisplay";
import React from "react";

export function PathExpressionInput(props: {
    pathExpression: string,
    handlePathExpressionChange: (s: string) => Promise<void>
}) {
    return <div id="pathExpressionInput">
        Path Expression:
           <CodeDisplay
            key="pathExpressionInput"
            code={props.pathExpression}
            handleCodeChange={props.handlePathExpressionChange}
            className="pathExpressionInput" />
    </div>
};