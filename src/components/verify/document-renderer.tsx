/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  FrameActions,
  FrameConnector,
  HostActionsHandler,
  print,
  renderDocument,
  selectTemplate,
} from "@govtechsg/decentralized-renderer-react-components";
import { getData, v2, WrappedDocument } from "@govtechsg/open-attestation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs } from "../tabs";

interface DocumentRendererProps {
  rawDocument: WrappedDocument<v2.OpenAttestationDocument>;
}

export const DocumentRenderer: React.FunctionComponent<DocumentRendererProps> = ({
  rawDocument,
}: DocumentRendererProps) => {
  const document = useMemo(() => getData(rawDocument), [rawDocument]);
  const [templates, setTemplates] = useState<{ id: string; label: string }[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const updateTemplates = useCallback((templates) => {
    setTemplates(templates);
    setSelectedTemplate(templates[0].id);
  }, []);

  const [toFrame, setToFrame] = useState<HostActionsHandler>();
  const [height, setHeight] = useState(0);
  const onConnected = useCallback((toFrame: HostActionsHandler) => {
    // wrap into a function otherwise toFrame function will be executed
    setToFrame(() => toFrame);
  }, []);

  const fromFrame = useCallback(
    (action: FrameActions): void => {
      if (action.type === "UPDATE_HEIGHT") {
        setHeight(action.payload);
      }
      if (action.type === "UPDATE_TEMPLATES") {
        updateTemplates(action.payload);
      }
    },
    [updateTemplates]
  );

  useEffect(() => {
    if (toFrame) {
      toFrame(renderDocument({ document }));
    }
  }, [document, toFrame]);

  useEffect(() => {
    if (toFrame && selectedTemplate) {
      toFrame(selectTemplate(selectedTemplate));
    }
  }, [selectedTemplate, toFrame]);

  return (
    <div className="mb-8">
      {templates.length > 0 && (
        <Tabs
          templates={templates}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={(selectedTemplate) => setSelectedTemplate(selectedTemplate)}
          onPrint={() => {
            return toFrame?.(print());
          }}
        />
      )}
      <FrameConnector
        css={css`
          @media print {
            display: none;
          }
        `}
        style={{ height: `${height}px`, width: "100%", border: "0px" }}
        source={`${typeof document.$template === "object" ? document.$template.url : document.$template}`}
        onConnected={onConnected}
        dispatch={fromFrame}
      />
      <div
        css={css`
          @media print {
            display: block;
          }
        `}
        className="hidden bg-red-100 border-t-4 border-red-500 text-red-700 p-4 w-full text-center break-all mt-8"
      >
        If you want to print the certificate, please click on the highlighted button above.
      </div>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default DocumentRenderer;
