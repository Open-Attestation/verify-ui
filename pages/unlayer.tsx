import { NextPage } from "next";
import { useRef } from "react";
import React from "react";

import EmailEditor from "react-email-editor";
import NoSSR from "@components/ssr/NoSSR";
import Layout from "@components/layout/Layout";
import parse from "html-react-parser";

const Unlayer: NextPage = () => {
  const emailEditorRef = useRef(null);

  const exportHtml = () => {
    // @ts-ignore: Object is possibly 'null'.
    emailEditorRef.current.editor.exportHtml((data: { design: any; html: any }) => {
      const { design, html } = data;
      console.log("exportHtml", html);
    });
  };

  const onLoad = () => {
    // editor instance is created
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  };

  const onReady = () => {
    // editor is ready
    console.log("onReady");
  };

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <NoSSR>
          <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
        </NoSSR>

        <button
          onClick={exportHtml}
          className={`m-8 font-bold py-2 px-4 text-white bg-primary hover:bg-primary-dark rounded-xl focus:ring transition-colors`}
        >
          Export HTML
        </button>
      </div>
    </Layout>
  );
};

export default Unlayer;
