import { NextApiRequest, NextApiResponse } from "next";

function generateRobotsTxt(host: string) {
  return `
        User-agent: *
        Disallow: /customer/
        Disallow: /contact-us
        Allow: /

        Sitemap: ${host}/sitemap.xml
      `;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const host = req.headers.host || "default-host";
  const robotsTxt = generateRobotsTxt(`https://${host}`);

  res.setHeader("Content-Type", "text/plain");
  res.write(robotsTxt);
  res.end();
}
