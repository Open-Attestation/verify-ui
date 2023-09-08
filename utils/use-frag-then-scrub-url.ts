import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type UseFragmentThenScrubUrlParam = {
  /** extraction and scrubbing will only happen if this is true */
  enabled: boolean;
};
type Fragment = {
  value: string;
};
export const useFragmentThenScrubUrl = ({ enabled }: UseFragmentThenScrubUrlParam): Fragment | undefined => {
  // fragment will only be undefined before the second render
  // being undefined means the fragment has not been extracted and the url has not been scrubbed yet
  const [fragment, setFragment] = useState<string | undefined>(!enabled ? "" : undefined);
  const router = useRouter();

  useEffect(() => {
    if (enabled)
      setFragment((currFragment) => {
        // once the fragment is set, we never update it again
        if (currFragment !== undefined) return currFragment;

        // extract and save fragment
        const savedFragment = window.location.hash.substring(1);

        // scrubbbb itttttt
        window.location.hash = "";

        return savedFragment;
      });
  }, [fragment, router, enabled]);

  if (fragment === undefined) {
    return undefined;
  }

  return { value: fragment };
};
