import { ErrorResponse } from "../TreeParseGUIState";
import React from "react";


export function ErrorDisplay(props: { possibleError: ErrorResponse | undefined }) {
    if (props.possibleError === undefined) {
        return <div id="ErrorDisplay" className="no-error" />
    }
    return <div id="ErrorDisplay" className="error-display">{props.possibleError.error.message}</div>
}