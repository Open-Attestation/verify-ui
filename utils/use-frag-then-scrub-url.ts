import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

type UseFragmentThenScrubUrlParam = {
  /** extraction and scrubbing will only happen if this is true */
  enabled: boolean;
};
type UrlParams = {
  uriFragment: string;
  query: ParsedUrlQuery;
};
export const useUrlParamsThenScrubUrl = ({ enabled }: UseFragmentThenScrubUrlParam): UrlParams | undefined => {
  // urlParams will only be undefined before the second render
  // being undefined means the urlParams has not been extracted and the url has not been scrubbed yet
  const [urlParams, setUrlParams] = useState<UrlParams | undefined>(
    !enabled
      ? {
          uriFragment: "",
          query: {},
        }
      : undefined
  );
  const router = useRouter();

  useEffect(() => {
    if (enabled)
      setUrlParams((currUrlParams) => {
        // once the fragment is set, we never update it again
        if (currUrlParams !== undefined) return currUrlParams;

        const savedFragment = window.location.hash.substring(1);
        const savedQueryParam = { ...router.query };

        // scrubbbb fragment
        window.location.hash = "";
        router.replace({}, undefined, { shallow: true });

        return { uriFragment: savedFragment, query: savedQueryParam };
      });
  }, [urlParams, router, enabled]);

  return urlParams;
};
