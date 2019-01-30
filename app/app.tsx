import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import * as React from "react";
import * as ReactDOM from "react-dom";
import theme from "../static/theme";
import { TreeParseGUI } from "./components/TreeParseGUI";

ReactDOM.render(<MuiThemeProvider theme={theme}><TreeParseGUI /></MuiThemeProvider>, document.getElementById("main"));
