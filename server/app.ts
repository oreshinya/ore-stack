import { createRequestHandler } from "@react-router/express";
import express from "express";
import { RouterContextProvider } from "react-router";

import { cspNonceContext } from "~/router-contexts/csp-nonce";

export const app = express();

app.use(
  createRequestHandler({
    // @ts-expect-error
    build: () => import("virtual:react-router/server-build"),
    getLoadContext: (_, res) => {
      const context = new RouterContextProvider();
      context.set(cspNonceContext, res.locals["cspNonce"]);
      return context;
    },
  }),
);
