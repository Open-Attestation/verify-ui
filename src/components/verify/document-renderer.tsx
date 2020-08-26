import { FrameActions, FrameConnector, HostActionsHandler } from "@govtechsg/decentralized-renderer-react-components";
import { getData, WrappedDocument } from "@govtechsg/open-attestation";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Tabs } from "../tabs";

interface DocumentRendererProps {
  rawDocument: WrappedDocument;
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
      toFrame({
        type: "RENDER_DOCUMENT",
        payload: {
          document,
        },
      });
    }
  }, [document, toFrame]);

  useEffect(() => {
    if (toFrame && selectedTemplate) {
      toFrame({
        type: "SELECT_TEMPLATE",
        payload: selectedTemplate,
      });
    }
  }, [selectedTemplate, toFrame]);

  return (
    <>
      {templates.length > 0 && (
        <Tabs
          templates={templates}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={(selectedTemplate) => setSelectedTemplate(selectedTemplate)}
        />
      )}
      <FrameConnector
        style={{ height: `${height}px`, width: "100%", border: "0px" }}
        source={document.$template.url}
        onConnected={onConnected}
        dispatch={fromFrame}
      />
    </>
  );
};
