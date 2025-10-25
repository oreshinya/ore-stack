import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export function basicAuth(username: string, password: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Basic ")) {
      const credentials = Buffer.from(authHeader.slice(6), "base64").toString(
        "utf-8",
      );
      const [user, pass] = credentials.split(":");

      if (seccmp(user || "", username) && seccmp(pass || "", password)) {
        return next();
      }
    }

    res.setHeader("WWW-Authenticate", 'Basic realm="Protected"');
    res.sendStatus(401);
  };
}

function seccmp(a: string, b: string) {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}
