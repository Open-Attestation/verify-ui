import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HomePage } from "./components/home/home-page";
import { Footer } from "./components/shared/footer";
import { Header } from "./components/shared/header";
import { VerifyPage } from "./pages/verify";

export const App: React.FunctionComponent = () => (
  <Router>
    <Header />
    <Switch>
      <Route path="/verify">
        <VerifyPage />
      </Route>
      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
    <Footer />
  </Router>
);
