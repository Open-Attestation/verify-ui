import { FrameActions, FrameConnector, HostActionsHandler } from "@govtechsg/decentralized-renderer-react-components";
import { getData, WrappedDocument } from "@govtechsg/open-attestation";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Tabs } from "./tabs";

interface DocumentRendererProps {
  rawDocument: WrappedDocument;
}

export const DocumentRenderer: React.FunctionComponent<DocumentRendererProps> = ({
  rawDocument,
}: DocumentRendererProps) => {
  const document = useMemo(() => getData(rawDocument), [rawDocument]);
  const [templates, setTemplates] = useState<{ id: string; label: string }[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loadedDocumentId, setLoadedDocumentId] = useState<string>();

  const updateTemplates = useCallback((templates) => {
    setTemplates(templates);
    setSelectedTemplate(templates[0].id);
  }, []);

  const [toFrame, setToFrame] = useState<HostActionsHandler | null>(null);
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

  // let's set the frame action to null every time a new document is passed down, the actions will be set once the connection established
  useEffect(() => {
    setToFrame(null);
    setLoadedDocumentId(document.id);
  }, [document]);

  useEffect(() => {
    // check if there was a document rendered previously, so that toFrame will be reset to null.
    if (loadedDocumentId && loadedDocumentId !== document.id) {
      setToFrame(null);
    } else if (toFrame) {
      toFrame({
        type: "RENDER_DOCUMENT",
        payload: {
          document,
        },
      });
    }
  }, [document, toFrame, loadedDocumentId]);

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
        key={document.id} // we will reset the connection every time the id change (react will mount a new component)
      />
    </>
  );
};
