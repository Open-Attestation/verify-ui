import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import { VerificationStatus } from "@root/types";

type Checks = "DOCUMENT_STATUS" | "DOCUMENT_INTEGRITY" | "ISSUER_IDENTITY";

export type VerificationChecksProps = {
  [key in Checks]: VerificationStatus;
};

export type CustomMessageProps = {
  customMessage?: {
    [key in Checks]?: { [key in VerificationStatus]?: string };
  };
};

const genIcon = (status: VerificationStatus) => {
  switch (status) {
    case "PENDING":
      return <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-2xl text-gray-500/80" />;
    case "VERIFIED":
      return <FontAwesomeIcon icon={faCircleCheck} className="text-2xl text-green-500/80" />;
    case "REJECTED":
    default:
      return <FontAwesomeIcon icon={faCircleXmark} className="text-2xl text-red-500/80" />;
  }
};

const genMessage = (status: VerificationStatus, message: { [key in VerificationStatus]: string }) => {
  return <span>{message[status]}</span>;
};

const VerificationChecks: React.FC<VerificationChecksProps & CustomMessageProps> = ({
  DOCUMENT_STATUS,
  DOCUMENT_INTEGRITY,
  ISSUER_IDENTITY,
  customMessage,
}) => (
  <ol data-testid="verification-checks" className="list-none leading-relaxed">
    <li className="flex gap-2 items-center">
      {genIcon(DOCUMENT_STATUS)}
      {genMessage(DOCUMENT_STATUS, {
        PENDING: customMessage?.DOCUMENT_STATUS?.PENDING || "Checking if document was issued",
        VERIFIED: customMessage?.DOCUMENT_STATUS?.VERIFIED || "Document has not been revoked",
        REJECTED: customMessage?.DOCUMENT_STATUS?.REJECTED || "Document has not been issued",
      })}
    </li>
    <li className="flex gap-2 items-center">
      {genIcon(DOCUMENT_INTEGRITY)}
      {genMessage(DOCUMENT_INTEGRITY, {
        PENDING: customMessage?.DOCUMENT_INTEGRITY?.PENDING || "Checking if document has been tampered",
        VERIFIED: customMessage?.DOCUMENT_INTEGRITY?.VERIFIED || "Document has not been tampered with",
        REJECTED: customMessage?.DOCUMENT_INTEGRITY?.REJECTED || "Document has been tampered with",
      })}
    </li>
    <li className="flex gap-2 items-center">
      {genIcon(ISSUER_IDENTITY)}
      {genMessage(ISSUER_IDENTITY, {
        PENDING: customMessage?.ISSUER_IDENTITY?.PENDING || "Checking issuer identity",
        VERIFIED: customMessage?.ISSUER_IDENTITY?.VERIFIED || "Document’s issuer has been identified",
        REJECTED: customMessage?.ISSUER_IDENTITY?.REJECTED || "Document’s issuer has not been identified",
      })}
    </li>
  </ol>
);

export default VerificationChecks;
