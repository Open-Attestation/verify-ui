import { useState, useCallback, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

import { OpenAttestationDocument } from "@govtechsg/open-attestation";
import handlebars from "handlebars";
import { getTemplateUrl } from "@utils/oa-details";

interface RendererProps extends React.HTMLAttributes<HTMLDivElement> {
  document: OpenAttestationDocument;
}

const HtmlRenderer: React.FC<RendererProps> = ({ document }) => {
  const [template, setTemplate] = useState("");
  const [height, setHeight] = useState(0);
  const [views, setViews] = useState<string[]>();

  const templateUrl = getTemplateUrl(document);

  let templateObj = {
    views: [],
    heights: [],
    templates: [],
  };

  const fetchTemplate = () => {
    fetch("http://localhost:1234/api/template", {
      method: "POST",
      body: JSON.stringify({ url: templateUrl }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      res.text().then((txt) => {
        templateObj = JSON.parse(txt);
        setTemplate(templateObj.templates[0]);
        setViews(templateObj.views);
      });
    });
  };

  const renderTemplate = (template: String, document: any) => {
    if (template.length === 0) return "";
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(document);
  };

  const handlePrint = useCallback(() => {
    console.log("Handle print called");
    const test = iframeRef?.current!;
    test.focus();
    test.contentWindow?.print();
  }, []);

  const handleTemplateSelection = useCallback(
    (index: number) => () => {
      setTemplate(templateObj.templates[index]);
    },
    []
  );

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchTemplate();
    window.addEventListener("resize", resizeIFrame);
  }, []);

  const resizeIFrame = () => {
    setTimeout(() => {
      console.log("offsetHeight", iframeRef?.current?.contentWindow?.document.body.offsetHeight);
      setHeight((iframeRef?.current?.contentWindow?.document.body.offsetHeight ?? 0) + 16);
    }, 200);
  };

  // Adjust height 200ms after template is set
  useEffect(() => {
    resizeIFrame();
  }, [template]);

  return (
    <article className="my-10">
      <nav className="flex gap-4 gap-y-6 justify-between flex-wrap">
        <ul className="flex gap-2 flex-wrap print:opacity-50">
          {views?.map((view, i) => (
            <li
              data-testid="renderer-tab"
              key={i}
              onClick={handleTemplateSelection(i)}
              className="p-4 text-lg select-none font-bold border-t-4 border-primary shadow-lg bg-white hover:bg-primary hover:text-white transition-colors"
            >
              {view}
            </li>
          ))}
        </ul>
        <div className="ml-auto">
          <button
            className="my-2 p-4 rounded-lg shadow-lg bg-white print:ring-8 print:ring-orange-500 text-primary hover:bg-primary hover:text-white transition-colors"
            aria-label="document-utility-print-button"
            onClick={handlePrint}
          >
            <FontAwesomeIcon icon={faPrint} className="text-xl" />
          </button>
        </div>
      </nav>
      <div className="bg-white print:hidden">
        <iframe
          className="w-full max-w-full"
          srcDoc={renderTemplate(template, document)}
          style={{ height: `${height}px`, width: "100%", border: "0px" }}
          ref={iframeRef}
          sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
        />
      </div>
      <div className="hidden print:block mt-5 bg-orange-100/50 border-t-4 border-orange-500 p-4 text-center font-bold">
        To print the certificate, please click on print button highlighted above.
      </div>
    </article>
  );
};

export default HtmlRenderer;
