import { NextPage, GetStaticProps } from "next";

const NotFound: NextPage = () => null;

export const getStaticProps: GetStaticProps = () => ({
  redirect: {
    destination: "/",
    permanent: false,
  },
});

export default NotFound;
