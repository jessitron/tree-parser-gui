import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { ThemeKeys } from "react-json-view";
import { TreeChoices, TreeParseGUIState } from "../../TreeParseGUIState";

export interface HowToDisplay {
    treeToRender: any;
    theme: ThemeKeys;
}

export function effectiveTreeChoice(tpgs: TreeParseGUIState) {
    const available = availableTreeChoices(tpgs);
    if (available.includes(tpgs.chosenTree)) {
        return tpgs.chosenTree;
    }
    return available[0];
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

export function availableTreeChoices(tpgs: TreeParseGUIState): TreeChoices[] {
    const available = [TreeChoices.ast];
    if (_.has(tpgs, "error.error.tree")) {
        available.push(TreeChoices.parsingError);
    }
    return available;
}

export interface RadioChoiceSpec<Enum> {
    value: Enum; label: string; disabled?: boolean;
}

export function TreeChoice(props: {
    treeToDisplay: TreeChoices,
    availableChoices: TreeChoices[],
    chooseTree: (event: React.ChangeEvent, tc: TreeChoices) => void,
}) {

    const radioOptions = disableUnavailable([
        { value: TreeChoices.ast, label: "Parsed" },
        { value: TreeChoices.parsingError, label: "Parsing Error" },
    ], props.availableChoices);

    return <FormControl>
        <FormLabel component="legend">Choose A Parser</FormLabel>
        <RadioGroup
            key="tree-display-choice"
            value={props.treeToDisplay}
            onChange={props.chooseTree}>
            {radioInputs("treeChoice", radioOptions)}
        </RadioGroup>
    </FormControl>;
}

function disableUnavailable<Enum>(
    ri: Array<RadioChoiceSpec<Enum>>,
    availables: Enum[]) {

    return ri.map((i) => ({ ...i, disabled: !availables.includes(i.value) }));
}

function radioInputs(name, valueAndLabelses) {
    const oneInput = (params: RadioChoiceSpec<any>) => {
        const { value, label, disabled } = params;
        return <FormControlLabel
            value={value} name={name}
            control={<Radio color="primary" />}
            label={label}
            disabled={!!disabled}
            color="white"
            key={value} />;
    };
    return valueAndLabelses.map(oneInput);
}

// TODO next: make unavailable the choices that don't work
