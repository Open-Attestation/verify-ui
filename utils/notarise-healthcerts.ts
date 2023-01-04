import { OpenAttestationDocument } from "@govtechsg/open-attestation";

// FIXME: If HealthCert type annotation is required, obtain from @govtechsg/oa-schemata
export const isVac = (doc: any): boolean => doc?.name === "VaccinationHealthCert";
export const isPDT = (doc: any): boolean => doc?.name === "HealthCert" || doc?.version === "pdt-healthcert-v2.0";
export const isREC = (doc: any): boolean => doc?.version === "rec-healthcert-v2.0";

export const isHealthCert = (document: OpenAttestationDocument): boolean => {
  return isVac(document) || isPDT(document) || isREC(document);
};

export const isNotariseTransientStorage = (url = "") => {
  const notariseTransientStorageSuffixes = ["storage.staging.notarise.io", "storage.aws.notarise.gov.sg"];

  const { hostname } = new URL(url);

  return notariseTransientStorageSuffixes.some((suffix) => hostname.endsWith(suffix));
};

export const isNotariseSpmTransientStorage = (url = "") => {
  const notariseSpmTransientStoragePrefixes = ["api-spm-vac", "api-spm-recov"];

  const { hostname } = new URL(url);

  return (
    isNotariseTransientStorage(url) && notariseSpmTransientStoragePrefixes.some((prefix) => hostname.startsWith(prefix))
  );
};
