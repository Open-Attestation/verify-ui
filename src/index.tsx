import React from "react";
import ReactDOM from "react-dom";
// it will fail in the ci because the file may not exist => disabled
// eslint-disable-next-line import/no-unresolved
import "./index.css";
import { App } from "./app";

ReactDOM.render(<App />, document.getElementById("root"));
