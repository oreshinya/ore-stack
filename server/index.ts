import { createRequestHandler } from "@react-router/express";
import closeWithGrace from "close-with-grace";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import {
  BASIC_AUTH_PASSWORD,
  BASIC_AUTH_USER,
  BIND_ADDRESS,
  HOST,
  NODE_ENV,
  PORT,
} from "~env";
import { basicAuth } from "./basic-auth";

const isProduction = NODE_ENV === "production";

const viteDevServer = isProduction
  ? undefined
  : await import("vite").then((vite) =>
      vite.createServer({
        server: { middlewareMode: true },
      }),
    );

const app = express();

app.disable("x-powered-by");

app.use(compression());

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
}

app.use(morgan("tiny"));

app.get("/health", (_, res) => {
  return res.sendStatus(200);
});

if (BASIC_AUTH_USER && BASIC_AUTH_PASSWORD) {
  app.use(basicAuth(BASIC_AUTH_USER, BASIC_AUTH_PASSWORD));
}

app.use(
  helmet({
    contentSecurityPolicy: false,
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
    strictTransportSecurity: false,
    xPoweredBy: false,
  }),
);

if (isProduction) {
  app.use(
    helmet.strictTransportSecurity({
      maxAge: 365 * 24 * 60 * 60,
      includeSubDomains: false,
    }),
  );
}

// CSRF Protection
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    if (req.headers["origin"] && req.headers["origin"] !== HOST) {
      res.sendStatus(400);
      return;
    }
    if (
      req.headers["sec-fetch-site"] &&
      req.headers["sec-fetch-site"] !== "same-origin"
    ) {
      res.sendStatus(400);
      return;
    }
  }
  next();
});

// handle SSR requests
app.all(
  "/{*splat}",
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule("virtual:react-router/server-build")
      : // @ts-expect-error
        await import("../build/server/index.js"),
  }),
);

const server = app.listen(PORT, BIND_ADDRESS, () => {
  console.log(`Express server listening at http://${BIND_ADDRESS}:${PORT}`);
});

closeWithGrace(async () => {
  await new Promise((resolve, reject) => {
    server.close((e) => (e ? reject(e) : resolve("ok")));
  });
});
