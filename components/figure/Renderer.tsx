import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { isActionOf } from "typesafe-actions";
import {
  FrameActions,
  HostActionsHandler,
  print,
  renderDocument,
  selectTemplate,
  updateTemplates,
  updateHeight,
  Template,
} from "@govtechsg/decentralized-renderer-react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

import { getTemplateUrl } from "@utils/oa-details";
import { OpenAttestationDocument, WrappedDocument } from "@govtechsg/open-attestation";
import { sendCertificatePrintEvent } from "@utils/google-analytics";

/* Workaround for undefined window object: Dynamic import so FrameConnector will not load on server-side */
// FIXME: Weird type error occurs without dynamic<any> (i.e. type error occurs when you do not specify props type for FrameConnector)
const FrameConnector = dynamic<any>(
  () => import("@govtechsg/decentralized-renderer-react-components").then((m) => m.FrameConnector),
  { ssr: false }
);

interface RendererProps extends React.HTMLAttributes<HTMLDivElement> {
  document: OpenAttestationDocument;
  rawDocument: WrappedDocument<OpenAttestationDocument>;
}

const Renderer: React.FC<RendererProps> = ({ document, rawDocument }) => {
  const [height, setHeight] = useState(0);
  const [templates, setTemplates] = useState<Template[]>();
  const [toFrame, setToFrame] = useState<HostActionsHandler>();

  const onConnected = useCallback(
    (toFrame: HostActionsHandler) => {
      toFrame(renderDocument({ document, rawDocument }));
      setToFrame(() => toFrame);
    },
    [document, rawDocument]
  );

  const fromFrame = useCallback((action: FrameActions) => {
    if (isActionOf(updateHeight, action)) {
      setHeight(action.payload);
    } else if (isActionOf(updateTemplates, action)) {
      setTemplates(action.payload);
    }
  }, []);

  const handlePrint = useCallback(async () => {
    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/i.test(ua);
    // List of common browsers installable from app store
    const isNotSafari = /CriOS|FxiOS|EdgiOS|YaBrowser|OPT|OPR/i.test(ua);
    const isSamsungBrowser = /SamsungBrowser/i.test(ua);
    // https://stackoverflow.com/questions/36523448/how-do-i-tell-if-a-user-is-using-brave-as-their-browser/60954062#60954062
    // no typings for browser-specific fields - https://github.com/microsoft/TypeScript/issues/41532
    const isBraveBrowser =
      ((window.navigator as any).brave && (await (window.navigator as any).brave.isBrave())) || false;

    const isUnsupportedBrowser = (isIOS && (isNotSafari || isBraveBrowser)) || isSamsungBrowser;

    if (isUnsupportedBrowser) {
      alert(
        "Printing this document is not optimised on your device.\nFor the best result, use: \n- Chrome on Android devices \n- Safari on IOS devices \n- Any major browsers on desktop"
      );
    }
    sendCertificatePrintEvent(document, { isSupportedBrowser: !isUnsupportedBrowser });
    toFrame && toFrame(print());
  }, [document, toFrame]);

  const handleTemplateSelection = useCallback(
    (template: Template) => () => {
      toFrame && toFrame(selectTemplate(template.id));
    },
    [toFrame]
  );

  return (
    <article className="my-10">
      <nav className="flex gap-4 gap-y-6 justify-between flex-wrap">
        <ul className="flex gap-2 flex-wrap print:opacity-50">
          {templates?.map((t, i) => (
            <li
              data-testid="renderer-tab"
              key={i}
              onClick={handleTemplateSelection(t)}
              className="p-4 text-lg select-none font-bold border-t-4 border-primary shadow-lg bg-white hover:bg-primary hover:text-white transition-colors"
            >
              {t.label}
            </li>
          ))}
        </ul>
        <div className="ml-auto flex gap-2">
          <button
            className="w-14 h-14 my-2 p-4 rounded-lg shadow-lg bg-white print:ring-8 print:ring-orange-500 text-primary hover:bg-primary hover:text-white transition-colors"
            title="Print document"
            aria-label="document-utility-print-button"
            onClick={handlePrint}
          >
            <FontAwesomeIcon icon={faPrint} className="text-xl" />
          </button>
        </div>
      </nav>
      <div className="bg-white print:hidden">
        <FrameConnector
          style={{ height: `${height}px`, width: "100%", border: "0px" }}
          source={getTemplateUrl(document)}
          onConnected={onConnected}
          dispatch={fromFrame}
        />
      </div>
      <div className="hidden print:block mt-5 bg-orange-100/50 border-t-4 border-orange-500 p-4 text-center font-bold">
        To print the certificate, please click on print button highlighted above.
      </div>
    </article>
  );
};

export default Renderer;
