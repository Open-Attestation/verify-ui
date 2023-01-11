type UniversalActionType = "NONE" | "HOSTED_URL" | "EMBEDDED_URI_FRAGMENT";

interface UniversalActionQuery {
  q?: string;
  m?: string;
}

export const getUniversalActionType = (query?: UniversalActionQuery): UniversalActionType => {
  const hasHostedUrl = typeof query?.q === "string";
  const hasUriFragment = query?.m === "uri-fragment";

  if (hasUriFragment) return "EMBEDDED_URI_FRAGMENT";
  else if (hasHostedUrl) return "HOSTED_URL";
  else return "NONE";
};
