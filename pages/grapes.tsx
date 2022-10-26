import { NextPage } from "next";
import NoSSR from "@components/ssr/NoSSR";
import Layout from "@components/layout/Layout";
import "grapesjs-preset-newsletter";
import { GrapesjsReact } from "grapesjs-react";

const fields = ["document.recipient.name", "document.message", "document.signatory.name"];

const myPlugin = (editor: any) => {
  // fields.forEach((field) => {
  //   editor.BlockManager.add(`${field}-block`, {
  //     label: `OA editor ${field}`,
  //     content: `<p>\${${field}}</p>`,
  //   });
  // });

  const domc = editor.DomComponents;
  domc.addType("image-block", {
    extend: "default",
    model: {
      defaults: function () {
        return {
          name: "Background image",
          type: "image-block",
          tagName: "div",
          void: false,
          droppable: true,
        };
      },
    },
    view: {
      init() {
        const component = this as any;
        component.listenTo(component.model, "active", component.onActive);
        component.listenTo(component.model, "change:src", component.updateImage);
      },
      events: {
        dblclick: "onActive",
      },
      onActive() {
        const component = this as any;
        editor.runCommand("open-assets", {
          target: component.model,
          types: ["image"],
          accept: "image/*",
        });
      },
      updateImage(model: any, url: string) {
        if (url) {
          const style = model.getStyle();
          model.setStyle({
            "background-image": style["background-color"] || `url("${url}")`,
            "background-size": style["background-size"] || "cover",
            "background-position": style["background-position"] || "center center",
            "background-repeat": style["background-repeat"] || "no-repeat",
            height: style["height"],
          });
        }
      },
    },
  });
  const bm = editor.BlockManager;
  bm.add("image-block", {
    attributes: { class: "gjs-fonts gjs-f-image" },
    label: "Background Image",
    category: "Basic",
    content: {
      type: "image-block",
      activeOnRender: true,
      style: {
        "background-image": `url('${window.origin}/images/image-placeholder.png')`,
        height: "100%",
        "background-size": "cover",
        "background-position": "center center",
        "background-repeat": "no-repeat",
      },
    },
  });
};

const Grapes: NextPage = () => {
  return (
    <Layout>
      <NoSSR>
        <GrapesjsReact
          id="grapesjs-react"
          plugins={["grapesjs-plugin-export", "gjs-preset-newsletter", "gjs-blocks-basic", myPlugin]}
          // onInit={(editor) => {
          //   editor?.Css.clear();
          // }}
          canvasCss='[data-gjs-type="wrapper"] { height: 100vh }'
        />
      </NoSSR>
    </Layout>
  );
};

export default Grapes;
