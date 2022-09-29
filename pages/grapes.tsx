import { NextPage } from "next";
import NoSSR from "@components/ssr/NoSSR";
import Layout from "@components/layout/Layout";
import "grapesjs-preset-newsletter";
import { GrapesjsReact } from "grapesjs-react";

const fields = ["document.recipient.name", "document.message", "document.signatory.name"];

const myPlugin = (editor: any) => {
  fields.forEach((field) => {
    editor.BlockManager.add(`${field}-block`, {
      label: `OA editor ${field}`,
      content: `<p>\${${field}}</p>`,
    });
  });
};

const Grapes: NextPage = () => {
  return (
    <Layout>
      <NoSSR>
        <GrapesjsReact id="grapesjs-react" plugins={["grapesjs-plugin-export", "gjs-preset-newsletter", "gjs-blocks-basic", myPlugin]} />
      </NoSSR>
    </Layout>
  );
};

export default Grapes;
