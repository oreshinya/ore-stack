import crypto from "node:crypto";

import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import closeWithGrace from "close-with-grace";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { queue } from "~/adapters/mq/queue";
import { BIND_ADDRESS, HOST, NODE_ENV, PORT } from "~env";

const MQ_BOARD_PATH = "/admin/mq";

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

const mqBoardAdapter = new ExpressAdapter();
mqBoardAdapter.setBasePath(MQ_BOARD_PATH);
createBullBoard({
  queues: [new BullMQAdapter(queue)],
  serverAdapter: mqBoardAdapter,
});
app.use(MQ_BOARD_PATH, mqBoardAdapter.getRouter());

// Generate nonce for CSP
app.use((_, res, next) => {
  res.locals["cspNonce"] = crypto.randomBytes(16).toString("hex");
  next();
});

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      "default-src": helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
      "base-uri": ["'none'"],
      "object-src": ["'none'"],
      "script-src": [
        // @ts-expect-error
        (_, res) => `'nonce-${res.locals.cspNonce}'`,
        "'unsafe-inline'",
        "'strict-dynamic'",
        "https:",
        "http:",
      ],
    },
  }),
);

// handle SSR requests
if (viteDevServer) {
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule("./server/app.ts");
      await source["app"](req, res, next);
    } catch (error) {
      if (error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
} else {
  // @ts-expect-error
  app.use(await import("../build/server/index.js").then((mod) => mod.app));
}

const server = app.listen(PORT, BIND_ADDRESS, () => {
  console.log(`Express server listening at http://${BIND_ADDRESS}:${PORT}`);
});

closeWithGrace(async () => {
  await new Promise((resolve, reject) => {
    server.close((e) => (e ? reject(e) : resolve("ok")));
  });
});
