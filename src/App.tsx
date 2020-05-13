import React from "react";
import { Counter } from "./components/Counter";
import logo from "./logo.svg";
import "./App.css";

export const App: React.FunctionComponent = () => (
  <div>
    <header className="flex flex-col items-center justify-center text-lg text-white min-h-screen bg-purple-700">
      <img src={logo} className="h-40 spin" alt="logo" />
      <Counter />
      <a className="text-teal-400" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
        Learn React
      </a>
    </header>
  </div>
);
