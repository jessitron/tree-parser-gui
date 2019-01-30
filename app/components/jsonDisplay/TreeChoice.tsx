import { FormControl, FormLabel, RadioGroup } from "@material-ui/core";
import React from "react";
import { ThemeKeys } from "react-json-view";
import { TreeChoices, TreeParseGUIState } from "../../TreeParseGUIState";

export interface HowToDisplay {
    treeToRender: any;
    theme: ThemeKeys;
}

export function howToDisplayTree(tpgs: TreeParseGUIState, tc: TreeChoices): HowToDisplay {
    switch (tc) {
        case TreeChoices.ast:
            return {
                treeToRender: tpgs.ast,
                theme: "apathy",
            };
        case TreeChoices.parsingError:
            return {
                treeToRender: tpgs.error.error.tree,
                theme: "apathy:inverted",
            };
    }
}

export function TreeChoice(props: {
    treeToDisplay: TreeChoices,
    chooseTree: (tc: TreeChoices) => void,
}) {

    const availableChoices = [
        { value: TreeChoices.ast, label: "Parsed" },
        { value: TreeChoices.parsingError, label: "Parsing Error" },
    ];

    return <FormControl>
        <FormLabel component="legend">Choose A Parser</FormLabel>
        <RadioGroup
            key="tree-display-choice"
            value={props.treeToDisplay}
            onChange={this.props.chooseTree}>
            {this.radioInputs("treeChoice", availableChoices)}
        </RadioGroup>
    </FormControl>;
}
