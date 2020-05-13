/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { FunctionComponent, useState } from "react";

interface CounterProps {
  /** Initial counter value */
  initialValue?: number;
}
const style = css`
  color: hotpink;
`;

const StyledButton = styled.button`
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  color: #000;
  background-color: lightblue;
  border-color: lightblue;
  cursor: pointer;
  margin: 1px;
`;
/**
 * Use `Counter` to embed a simple counter into your awesome application. It provides 2 buttons to increment / decrement counter value as well as an initial optional value.
 */
export const Counter: FunctionComponent<CounterProps> = ({ initialValue = 0 }) => {
  const [counter, setCounter] = useState(initialValue);
  return (
    <div className="flex flex-col items-center counter">
      <div className="text-center" css={style} data-testid="counter-content">
        Counter: {counter}
      </div>
      <div>
        <StyledButton
          onClick={() => {
            setCounter((counter) => counter + 1);
          }}
        >
          Increment
        </StyledButton>
        <StyledButton
          onClick={() => {
            setCounter((counter) => counter - 1);
          }}
        >
          Decrement
        </StyledButton>
      </div>
    </div>
  );
};
