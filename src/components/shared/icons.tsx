import styled from "@emotion/styled";
import React, { ImgHTMLAttributes } from "react";

const Image = styled.img`
  display: inline;
`;
const RotatingImage = styled(Image)`
  animation: rotation 2s infinite linear;
`;

export const Loader: React.FunctionComponent<ImgHTMLAttributes<any>> = (props) => (
  <RotatingImage src="images/shared/loader.svg" alt="loading..." {...props} />
);
export const CheckCircle: React.FunctionComponent<ImgHTMLAttributes<any>> = (props) => (
  <Image src="images/shared/check-circle.svg" alt="valid" {...props} />
);
