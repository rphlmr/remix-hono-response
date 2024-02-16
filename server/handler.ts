import { createRequestHandler } from "@remix-run/server-runtime";
import type { AppLoadContext, ServerBuild } from "@remix-run/server-runtime";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";

export interface RemixMiddlewareOptions {
  build: ServerBuild;
  mode?: "development" | "production";
  getLoadContext?(c: Context): Promise<AppLoadContext> | AppLoadContext;
}

export function remix({
  mode,
  build,
  getLoadContext = (c) => c.env as unknown as AppLoadContext,
}: RemixMiddlewareOptions) {
  return createMiddleware(async (c) => {
    let requestHandler = createRequestHandler(build, mode);
    let loadContext = getLoadContext(c);

    const response = await requestHandler(
      c.req.raw,
      loadContext instanceof Promise ? await loadContext : loadContext,
    );

    // console.log("1️⃣ response from Remix requestHandler", response);
    // console.log("2️⃣ response from Remix requestHandler", response.status);
    // console.log("3️⃣ response from Remix requestHandler", response);

    return response;
  });
}
