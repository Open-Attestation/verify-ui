import styled from "@emotion/styled";

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  & > * {
    max-width: 1280px;
    width: 1280px;
  }
  background: #faf9fb;
`;

export const Separator = styled.hr`
  border: 1px solid #eeecf1;
  margin: 10px 0 20px;
`;

export const Title = styled.div`
  font-family: Manjari;
  font-weight: bold;
  font-size: 42px;
  line-height: 49px;
  color: #5b5e62;
`;
