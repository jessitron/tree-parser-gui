import React from "react";
import { TreeParseGUIState } from "../TreeParseGUIState";

const falseIcon = "🚫";
const trueIcon = "✅";

export function TalkOutLoud(props: { everything: TreeParseGUIState }) {
    const parentState = props.everything;
    console.log("Talking out loud...");
    return <div className="talkOutLoud">Display code? {parentState.displayCode ? trueIcon : falseIcon}</div>;
}
