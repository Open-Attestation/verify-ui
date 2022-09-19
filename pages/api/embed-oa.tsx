import type { NextApiRequest, NextApiResponse } from "next";
import { JSDOM } from "jsdom";

const SITE_URL = process.env.SITE_URL; // See "next.config.js"

const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO: Validate incoming request method
  if (!(req.method === "POST")) {
    return res.status(405).end();
  }


  // TODO: Validate incoming request body
  const { oaDoc } = req.body;
  if (!(typeof oaDoc === "string" && isJsonString(oaDoc))) return res.status(400).send("Invalid payload");

  const parsedOaDoc = JSON.parse(oaDoc);

  const verifyUrl = new URL(`${SITE_URL}/verify`);
  verifyUrl.searchParams.append("embedded", "true");

  const verifyRes = await fetch(verifyUrl.toString());
  const verifyHtml = await verifyRes.text();

  const { document } = new JSDOM(verifyHtml).window;

  const xOa = document.createElement("x-oa");
  xOa.setAttribute("data-encoded-oa-doc", encodeURIComponent(JSON.stringify(parsedOaDoc)));

  document.body.appendChild(xOa);
  res.setHeader("Content-Type", "text/html; charset=UTF-8");
  return res.status(200).send(document.documentElement.innerHTML);
};
