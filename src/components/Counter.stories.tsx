import { number } from "@storybook/addon-knobs";
import React from "react";
import { Counter } from "./Counter";

export default {
  title: "Counter",
  component: Counter,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const CounterStory = () => (
  <div>
    <h1 className="storybook-title">Basic counter</h1>
    <Counter />
    <h1 className="storybook-title">Counter with initial value</h1>
    <Counter initialValue={number("Initial Value", 10)} />
  </div>
);
