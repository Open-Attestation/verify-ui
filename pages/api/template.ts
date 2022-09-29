import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result = "";
  const url = req.body.url;
  await fetch(url).then(async (res) => {
    result = await res.text();
  });

  const resObj = JSON.parse(result);
  res.status(200).json(resObj);
}
