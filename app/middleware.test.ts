import { RouterContextProvider } from "react-router";
import { assert, test, vi } from "vitest";
import { localeContext } from "~/router-contexts/locale";
import { middleware } from "./middleware";

test("middleware does not set a locale without a header", async () => {
  assert((await runMiddleware(buildRequest())) === undefined);
});

test("middleware sets a matched supported locale", async () => {
  assert((await runMiddleware(buildRequest("en"))) === "en");
  assert((await runMiddleware(buildRequest("en-US,en;q=0.9"))) === "en");
  assert((await runMiddleware(buildRequest("ja,en;q=0.8"))) === "en");
});

test("middleware does not set a locale for unsupported or malformed headers", async () => {
  assert((await runMiddleware(buildRequest("ja"))) === undefined);
  assert((await runMiddleware(buildRequest("fr-FR,fr;q=0.9"))) === undefined);
  assert((await runMiddleware(buildRequest(";;invalid;;"))) === undefined);
  assert((await runMiddleware(buildRequest("*"))) === undefined);
});

async function runMiddleware(request: Request) {
  const context = new RouterContextProvider();
  const spy = vi.spyOn(context, "set");
  for (const run of middleware) {
    await run(
      { request, url: new URL(request.url), pattern: "/", params: {}, context },
      async () => new Response(null),
    );
  }
  const call = spy.mock.calls.find(
    ([routerContext]) => routerContext === localeContext,
  );
  return call?.[1];
}

function buildRequest(acceptLanguage?: string) {
  if (acceptLanguage === undefined) return new Request("http://localhost/");
  return new Request("http://localhost/", {
    headers: { "accept-language": acceptLanguage },
  });
}
