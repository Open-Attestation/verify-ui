import styled from "@emotion/styled";
import { Footer } from "./footer";
import { Masthead } from "./masthead";
import { flexCenterColumn } from "./mixin";

export const Section = styled.section`
  ${flexCenterColumn()};
  background-color: var(--purple-light);
`;

export const Separator = styled.hr`
  border: 1px solid var(--grey-lighter);
  width: 100%;
  max-width: 1280px;
  margin: 20px 0;
`;

export function Layout({ children }: any) {
  return (
    <>
      <Masthead />
      <main>{children}</main>
      <Footer />
    </>
  );
}
