import type { NextPage } from "next";

import Layout from "@components/layout/Layout";
import Dropzone from "@components/verify/Dropzone";
import Verifier from "@components/verify/Verifier";

const Verify: NextPage = () => {
  return (
    <Layout>
      <Dropzone />
      {/* or */}
      {/* <Verifier /> */}
    </Layout>
  );
};

export default Verify;
