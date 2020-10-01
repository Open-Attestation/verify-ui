import { isValid, verificationBuilder } from "@govtechsg/oa-verify";
import { SchemaId, SignedWrappedDocument, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { verifyAllowedIssuers } from "./issuers-verifier";

const verify = verificationBuilder<
  | SignedWrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v3.OpenAttestationDocument>
>([verifyAllowedIssuers]);

const v2DocumentShared = {
  version: SchemaId.v2,
  signature: {
    merkleRoot: "",
    targetHash: "",
    proof: [],
    type: "SHA3MerkleProof" as const,
  },
};

describe("verifyAllowedIssuers", () => {
  it("should skip when the issuer does not have location, document store or token registry", async () => {
    const fragments = await verify(
      {
        data: {
          issuers: [{ name: "name" }],
        },
        ...v2DocumentShared,
      },
      { network: "ropsten" }
    );

    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "VerifyAllowedIssuers",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toBe(false);
  });
  it("should be valid when issuer has document store and location ends with gov.sg", async () => {
    const fragments = await verify(
      {
        data: {
          issuers: [
            {
              name: "name",
              documentStore: "0xabcd",
              identityProof: { location: "test.gov.sg", type: v2.IdentityProofType.DNSTxt },
            },
          ],
        },
        ...v2DocumentShared,
      },
      { network: "ropsten" }
    );

    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Array [
            "test.gov.sg",
          ],
          "name": "VerifyAllowedIssuers",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toBe(true);
  });
  it("should be valid when issuer has token registry and location ends with openattestation.com", async () => {
    const fragments = await verify(
      {
        data: {
          issuers: [
            {
              name: "name",
              tokenRegistry: "0xabcd",
              identityProof: { location: "test.openattestation.com", type: v2.IdentityProofType.DNSTxt },
            },
          ],
        },
        ...v2DocumentShared,
      },
      { network: "ropsten" }
    );

    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Array [
            "test.openattestation.com",
          ],
          "name": "VerifyAllowedIssuers",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toBe(true);
  });
  it("should be valid when issuer has token registry and location is openattestation.com", async () => {
    const fragments = await verify(
      {
        data: {
          issuers: [
            {
              name: "name",
              tokenRegistry: "0xabcd",
              identityProof: { location: "openattestation.com", type: v2.IdentityProofType.DNSTxt },
            },
          ],
        },
        ...v2DocumentShared,
      },
      { network: "ropsten" }
    );

    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Array [
            "openattestation.com",
          ],
          "name": "VerifyAllowedIssuers",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toBe(true);
  });
  it("should be valid when issuer has token registry and location is gov.sg", async () => {
    const fragments = await verify(
      {
        data: {
          issuers: [
            {
              name: "name",
              tokenRegistry: "0xabcd",
              identityProof: { location: "gov.sg", type: v2.IdentityProofType.DNSTxt },
            },
          ],
        },
        ...v2DocumentShared,
      },
      { network: "ropsten" }
    );

    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Array [
            "gov.sg",
          ],
          "name": "VerifyAllowedIssuers",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toBe(true);
  });
  it("should be invalid when issuer has document store and location starts with openattestation.com", async () => {
    const fragments = await verify(
      {
        data: {
          issuers: [
            {
              name: "name",
              documentStore: "0xabcd",
              identityProof: { location: "openattestation.com.fr", type: v2.IdentityProofType.DNSTxt },
            },
          ],
        },
        ...v2DocumentShared,
      },
      { network: "ropsten" }
    );

    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Array [
            "openattestation.com.fr",
          ],
          "name": "VerifyAllowedIssuers",
          "reason": Object {
            "code": 1,
            "codeString": "INVALID_IDENTITY",
            "message": "No issuers allowed by this platform found. Valid issuers are gov.sg,openattestation.com",
          },
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toBe(false);
  });
  it("should be invalid when issuer has document store and location starts with gov.sg", async () => {
    const fragments = await verify(
      {
        data: {
          issuers: [
            {
              name: "name",
              documentStore: "0xabcd",
              identityProof: { location: "gov.sg.com", type: v2.IdentityProofType.DNSTxt },
            },
          ],
        },
        ...v2DocumentShared,
      },
      { network: "ropsten" }
    );

    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Array [
            "gov.sg.com",
          ],
          "name": "VerifyAllowedIssuers",
          "reason": Object {
            "code": 1,
            "codeString": "INVALID_IDENTITY",
            "message": "No issuers allowed by this platform found. Valid issuers are gov.sg,openattestation.com",
          },
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toBe(false);
  });
  it("should be invalid when issuer has document store and location try to exploit the regex by replacing . by any char", async () => {
    const fragments = await verify(
      {
        data: {
          issuers: [
            {
              name: "name",
              documentStore: "0xabcd",
              identityProof: { location: "tech,govasg", type: v2.IdentityProofType.DNSTxt },
            },
          ],
        },
        ...v2DocumentShared,
      },
      { network: "ropsten" }
    );

    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Array [
            "tech,govasg",
          ],
          "name": "VerifyAllowedIssuers",
          "reason": Object {
            "code": 1,
            "codeString": "INVALID_IDENTITY",
            "message": "No issuers allowed by this platform found. Valid issuers are gov.sg,openattestation.com",
          },
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toBe(false);
  });
  it("should error when document is v3", async () => {
    const fragments = await verify(
      {
        version: SchemaId.v3,
        data: {
          name: "name",
          reference: "reference",
          validFrom: "validFrom",
          template: {
            name: "name",
            type: v3.TemplateType.EmbeddedRenderer,
            url: "url",
          },
          issuer: {
            name: "name",
            id: "id",
            identityProof: {
              type: v3.IdentityProofType.DNSTxt,
              location: "any",
            },
          },
          proof: {
            method: v3.Method.DocumentStore,
            type: v3.ProofType.OpenAttestationSignature2018,
            value: "value",
          },
        },
        signature: v2DocumentShared.signature,
      },
      { network: "ropsten" }
    );

    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": [Error: Verify does not support v3 document],
          "name": "VerifyAllowedIssuers",
          "reason": Object {
            "code": 3,
            "codeString": "UNSUPPORTED_V3_DOCUMENT",
            "message": "Verify does not support v3 document",
          },
          "status": "ERROR",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toBe(false);
  });
});
