import { isValid, verificationBuilder } from "@govtechsg/oa-verify";
import { SchemaId, v2 } from "@govtechsg/open-attestation";
import { isWhitelisted, verifyAllowedIssuers } from "./oa-verify";

const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME || "goerli";
const verify = verificationBuilder([verifyAllowedIssuers], { network: NETWORK_NAME });

const v2DocumentShared = {
  version: SchemaId.v2,
  signature: {
    merkleRoot: "",
    targetHash: "",
    proof: [],
    type: "SHA3MerkleProof" as const,
  },
};

describe("isWhitelisted", () => {
  it("should return true when identity is gov.sg", () => {
    expect(isWhitelisted("gov.sg")).toBe(true);
  });
  it("should return true when identity is openattestation.com", () => {
    expect(isWhitelisted("openattestation.com")).toBe(true);
  });
  it("should return true when identity ends by .gov.sg or .openattestation.com", () => {
    expect(isWhitelisted("tech.gov.sg")).toBe(true);
    expect(isWhitelisted("some.gov.sg")).toBe(true);
    expect(isWhitelisted("foo.openattestation.com")).toBe(true);
    expect(isWhitelisted("bar.openattestation.com")).toBe(true);
  });
  it("should return false when identity starts with gov.sg or openattestation.com", () => {
    expect(isWhitelisted("gov.sg.fr")).toBe(false);
    expect(isWhitelisted("gov.sg.sg")).toBe(false);
    expect(isWhitelisted("openattestation.com.other")).toBe(false);
    expect(isWhitelisted("openattestation.com.foo")).toBe(false);
  });
  it("should be invalid when the identity last . is replaced by any char", () => {
    //this test ensure that the . can't be exploit using the regex
    expect(isWhitelisted("tech.govasg")).toBe(false);
    expect(isWhitelisted("tech.openattestationccom")).toBe(false);
  });
  it("should be not be case sensitive, and allow domain with uppercase", () => {
    //this test ensure that the . can't be exploit using the regex
    expect(isWhitelisted("GOV.SG")).toBe(true);
    expect(isWhitelisted("gov.SG")).toBe(true);
    expect(isWhitelisted("Tech.gov.Sg")).toBe(true);
    expect(isWhitelisted("OPENATTESTATION.COM")).toBe(true);
    expect(isWhitelisted("OPENattestation.COM")).toBe(true);
    expect(isWhitelisted("Tech.oPENATTESTaTION.CoM")).toBe(true);
  });
  it("should return false when identity ends by gov.sg or openattestation.com", () => {
    expect(isWhitelisted("tech.pownedgov.sg")).toBe(false);
    expect(isWhitelisted("tech.pownedopenattestation.com")).toBe(false);
  });
  it("should return false because :)", () => {
    expect(isWhitelisted("penattestation.com")).toBe(false);
  });
  it("should return false when identity uses unicode chars", () => {
    // the first o of both occurence is a unicode char
    const govDomain = "g𝗈v.sg";
    const oaDomain = "𝗈penattestation.com";
    expect(isWhitelisted(govDomain)).toBe(false);
    expect(govDomain.charCodeAt(1)).toBe(55349);
    expect(isWhitelisted(oaDomain)).toBe(false);
    expect(oaDomain.charCodeAt(0)).toBe(55349);
  });
});

describe("verifyAllowedIssuers", () => {
  it("should be valid when issuer has document store and location ends with gov.sg", async () => {
    const fragments = await verify({
      data: {
        issuers: [
          {
            name: "name",
            documentStore: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            identityProof: { location: "test.gov.sg", type: v2.IdentityProofType.DNSTxt },
          },
        ],
      },
      ...v2DocumentShared,
    });

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
    const fragments = await verify({
      data: {
        issuers: [
          {
            name: "name",
            tokenRegistry: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            identityProof: { location: "test.openattestation.com", type: v2.IdentityProofType.DNSTxt },
          },
        ],
      },
      ...v2DocumentShared,
    });

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
    const fragments = await verify({
      data: {
        issuers: [
          {
            name: "name",
            tokenRegistry: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            identityProof: { location: "openattestation.com", type: v2.IdentityProofType.DNSTxt },
          },
        ],
      },
      ...v2DocumentShared,
    });

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
    const fragments = await verify({
      data: {
        issuers: [
          {
            name: "name",
            tokenRegistry: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            identityProof: { location: "gov.sg", type: v2.IdentityProofType.DNSTxt },
          },
        ],
      },
      ...v2DocumentShared,
    });

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
    const fragments = await verify({
      data: {
        issuers: [
          {
            name: "name",
            documentStore: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            identityProof: { location: "openattestation.com.fr", type: v2.IdentityProofType.DNSTxt },
          },
        ],
      },
      ...v2DocumentShared,
    });

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
    const fragments = await verify({
      data: {
        issuers: [
          {
            name: "name",
            documentStore: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            identityProof: { location: "gov.sg.com", type: v2.IdentityProofType.DNSTxt },
          },
        ],
      },
      ...v2DocumentShared,
    });

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
  it("should error when document is v3", async () => {
    const fragments = await verify({
      version: SchemaId.v3,
      data: {
        issuers: [],
      },
      proof: [],
      signature: v2DocumentShared.signature,
    });

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
