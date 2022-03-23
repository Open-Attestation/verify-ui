import { OpenAttestationDocument } from "@govtechsg/open-attestation";

// FIXME: If HealthCert type annotation is required, obtain from @govtechsg/oa-schemata
export const isVac = (doc: any): boolean => doc?.name === "VaccinationHealthCert";
export const isPDT = (doc: any): boolean => doc?.name === "HealthCert" || doc?.version === "pdt-healthcert-v2.0";

export const isHealthCert = (document: OpenAttestationDocument): boolean => {
  return isVac(document) || isPDT(document);
};
