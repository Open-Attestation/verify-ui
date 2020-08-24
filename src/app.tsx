import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { FaqPage } from "./components/faq/faq-page";
import { HomePage } from "./components/home/home-page";
import { Footer } from "./components/shared/footer";
import { Header } from "./components/shared/header";
import { ScrollToTop } from "./components/shared/scroll-to-top";
import { TermsPage } from "./components/terms/terms-page";
import { VerifyPage } from "./components/verify/verify-page";

export const App: React.FunctionComponent = () => (
  <Router>
    <ScrollToTop />
    <Header />
    <Switch>
      <Route path="/terms">
        <TermsPage />
      </Route>
      <Route path="/verify">
        <VerifyPage />
      </Route>
      <Route path="/faq">
        <FaqPage />
      </Route>
      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
    <Footer />
  </Router>
);
