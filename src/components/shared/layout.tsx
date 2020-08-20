import styled from "@emotion/styled";
import { flexCenterColumn } from "./mixin";

export const Section = styled.section`
  ${flexCenterColumn()};
  background: #faf9fb;
`;

export const Separator = styled.hr`
  border: 1px solid #eeecf1;
  width: 100%;
  max-width: 1280px;
  margin: 20px 0;
`;
