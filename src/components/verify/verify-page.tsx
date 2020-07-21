import styled from "@emotion/styled";
import React from "react";
import { NavigationBar } from "../shared/navigation-bar";
import { DropZone } from "./dropzone";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  & > * {
    max-width: 1280px;
    width: 1280px;
  }
  background: #faf9fb;
`;

const Title = styled.div`
  text-align: center;
  font-family: Manjari;
  font-weight: bold;
  font-size: 42px;
  line-height: 49px;
  margin-top: 20px;
  color: #5b5e62;
`;
const SubTitle = styled.div`
  text-align: center;
  color: #434144;
`;

const DropzoneContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 46px;
`;

export const VerifyPage: React.FunctionComponent = () => (
  <Section>
    <NavigationBar />
    <Title>Verify Documents</Title>
    <SubTitle>Drop a government issued certificate</SubTitle>
    <DropzoneContainer className="flex justify-center">
      <DropZone
        onDocumentDropped={() => {
          console.log("dropped");
        }}
      />
    </DropzoneContainer>
  </Section>
);
