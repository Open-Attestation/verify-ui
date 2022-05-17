import { OpenAttestationDocument } from "@govtechsg/open-attestation";

// FIXME: If HealthCert type annotation is required, obtain from @govtechsg/oa-schemata
export const isVac = (doc: any): boolean => doc?.name === "VaccinationHealthCert";
export const isPDT = (doc: any): boolean => doc?.name === "HealthCert" || doc?.version === "pdt-healthcert-v2.0";
export const isREC = (doc: any): boolean => doc?.version === "rec-healthcert-v2.0";

export const isHealthCert = (document: OpenAttestationDocument): boolean => {
  return isVac(document) || isPDT(document) || isREC(document);
};

export const isSpmTransientStorage = (url = "") => {
  const spmTransientStorages = [
    "https://api-spm-vac.storage.staging.notarise.io",
    "https://api-spm-vac.storage.aws.notarise.gov.sg",
    "https://api-spm-recov.storage.staging.notarise.io",
    "https://api-spm-recov.storage.aws.notarise.gov.sg",
  ];

  return spmTransientStorages.some((prefix) => url.startsWith(prefix));
};
