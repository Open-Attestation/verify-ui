import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Counter } from "./Counter";

describe("counter component", () => {
  it("should increment counter by 1 when clicking on increment button", () => {
    expect.assertions(2);
    render(<Counter />);
    expect(screen.getByTestId("counter-content")).toHaveTextContent("Counter: 0");
    userEvent.click(screen.getByRole("button", { name: /increment/i }));
    expect(screen.getByTestId("counter-content")).toHaveTextContent("Counter: 1");
  });
  it("should decrement counter by 1 when clicking on decrement button", () => {
    expect.assertions(2);
    render(<Counter />);
    expect(screen.getByTestId("counter-content")).toHaveTextContent("Counter: 0");
    userEvent.click(screen.getByRole("button", { name: /decrement/i }));
    expect(screen.getByTestId("counter-content")).toHaveTextContent("Counter: -1");
  });
  it("should start with initial value", () => {
    expect.assertions(1);
    render(<Counter initialValue={10} />);
    expect(screen.getByTestId("counter-content")).toHaveTextContent("Counter: 10");
  });
});
