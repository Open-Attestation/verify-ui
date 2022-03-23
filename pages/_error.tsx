import { NextPage, GetServerSideProps } from "next";

const NotFound: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/",
    permanent: false,
  },
});

export default NotFound;
