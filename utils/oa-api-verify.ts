import axios from "axios";
import { VerificationFragment } from "@govtechsg/oa-verify";

import { verify } from "@utils/oa-verify";

const API_VERIFY_URL = process.env.NEXT_PUBLIC_API_VERIFY_URL || "https://stg.api.verify.gov.sg/verify";

interface ApiVerifyResponse {
  isValid: Boolean;
  fragments: VerificationFragment[];
  diagnostics: { message: string }[];
}

export const apiVerifyWithFallback: typeof verify = async (document, promisesCallback) => {
  try {
    const { data } = await axios.post<ApiVerifyResponse>(API_VERIFY_URL, document);

    // Sanity check: Ensure fragments are received
    if (!data.fragments) {
      throw new Error("Verification fragment is missing");
    }

    return data.fragments;
  } catch (e) {
    console.error(`Unsuccessful response from ${API_VERIFY_URL} - Falling back to oa-verify`, "-", e);
    return await verify(document, promisesCallback);
  }
};
