import styled from "@emotion/styled";
import React, { ImgHTMLAttributes } from "react";
import checkCircleImage from "./images/check-circle.svg";
import loaderImage from "./images/loader.svg";

const Image = styled.img`
  display: inline;
`;
const RotatingImage = styled(Image)`
  animation: rotation 2s infinite linear;
`;

export const Loader: React.FunctionComponent<ImgHTMLAttributes<any>> = (props) => (
  <RotatingImage src={loaderImage} alt="loading..." {...props} />
);
export const CheckCircle: React.FunctionComponent<ImgHTMLAttributes<any>> = (props) => (
  <Image src={checkCircleImage} alt="valid" {...props} />
);
