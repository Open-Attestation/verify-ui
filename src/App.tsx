import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { routes } from "./routes";

export const App: React.FunctionComponent = () => (
  <Router>
    <Switch>
      {routes.map((route, id) => (
        <Route key={id} {...route} />
      ))}
    </Switch>
  </Router>
);
