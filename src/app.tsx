import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { FaqPage } from "./components/faq/faq-page";
import { HomePage } from "./components/home/home-page";
import { PrivacyPolicyPage } from "./components/privacy/privacy-policy-page";
import { Footer } from "./components/shared/footer";
import { Masthead } from "./components/shared/masthead";
import { ScrollToTop } from "./components/shared/scroll-to-top";
import { TermsPage } from "./components/terms/terms-page";
import { VerifyPage } from "./components/verify/verify-page";
import { useGoogleAnalytics } from "./services/google-analytics";

const Routes = () => {
  useGoogleAnalytics();

  return (
    <Switch>
      <Route path="/privacy-policy">
        <PrivacyPolicyPage />
      </Route>
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
  );
};

export const App: React.FunctionComponent = () => (
  <Router>
    <ScrollToTop />
    <Masthead />
    <main className="main">
      <Routes />
    </main>
    <Footer />
  </Router>
);
