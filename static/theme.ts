import {createMuiTheme} from "@material-ui/core/styles";

export default createMuiTheme({
    palette: {
        primary: {
            main: "#227F7E",
        },
        secondary: {
            main: "#5bc399",
        },
    },
    typography: {
        title: {
            color: "white",
        },
    },
    overrides: {
        MuiFormLabel: {
            root: {color: "white"},
        },
        MuiFormControlLabel: {
            label: {color: "white"},
        },
        MuiRadio: {
            root: {
                color: "#227F7E",
            },
        },
        MuiButton: {
            containedPrimary: {
                backgroundColor: "#5bc399",
                fontWeight: "bold",
            },
        },
    },
});
