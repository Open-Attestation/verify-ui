import { css } from "@emotion/core";
import styled from "@emotion/styled";

const buttonPrimaryBase = css`
  display: inline-block;
  padding: 10px 20px;
  background: var(--primary);
  border-radius: 15px;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: #ffffff;
  margin-top: 5px;
`;

export const ButtonPrimary = styled.button`
  ${buttonPrimaryBase}
`;
export const ButtonPrimaryLink = styled.div`
  ${buttonPrimaryBase}
`;
