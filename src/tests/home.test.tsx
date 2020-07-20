import { render } from "@testing-library/react";
import React from "react";
import { VerifyPage } from "../pages/verify";

describe("home page", () => {
  it("renders learn react link", () => {
    expect.assertions(1);
    const { getByText } = render(<VerifyPage />);
    const text = getByText("Drag and Drop your verifiable credentials");
    expect(text).toBeInTheDocument();
  });
});
