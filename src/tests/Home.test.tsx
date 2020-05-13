import { render } from "@testing-library/react";
import React from "react";
import { HomePage } from "../pages/home";

describe("home page", () => {
  it("renders learn react link", () => {
    expect.assertions(1);
    const { getByText } = render(<HomePage />);
    const textElement = getByText(/home page/i);
    expect(textElement).toBeInTheDocument();
  });
});
