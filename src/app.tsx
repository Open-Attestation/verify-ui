import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./pages/home";

export const App: React.FunctionComponent = () => (
  <Router>
    <Switch>
      <Route path="/verify">
        <HomePage />
      </Route>
      <Route path="/">
        <div>Hello world</div>
      </Route>
    </Switch>
  </Router>
);
