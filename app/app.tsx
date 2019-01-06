import * as React from "react";
import * as ReactDOM from "react-dom";
import { TreeParseGUI } from "./components/TreeParseGUI";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import theme from '../static/theme'

ReactDOM.render(<MuiThemeProvider theme={theme}><TreeParseGUI /></MuiThemeProvider>, document.getElementById('main'));