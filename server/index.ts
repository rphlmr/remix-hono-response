import { createServer, ServerResponse } from "node:http";

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import * as serverBuild from "@remix-run/dev/server-build";
import { broadcastDevReady, ServerBuild } from "@remix-run/server-runtime";
import { Hono } from "hono";

import { remix } from "./handler";
import { cache, logger } from "./middlewares";

const build = serverBuild as ServerBuild;

const mode =
  process.env.NODE_ENV === "test" ? "development" : process.env.NODE_ENV;

const app = new Hono();

/**
 * Serve build files from public/build
 */
app.use("/build/*", cache(0), serveStatic({ root: "./public" }));

/**
 * Serve static files from public
 */
app.use("/static/*", cache(0), serveStatic({ root: "./public" })); // 1 hour

/**
 * Add logger middleware
 */
app.use("*", logger());

/**
 * Add remix middleware to Hono server
 */
app.use(
  "*",
  remix({
    build,
    mode,
  }),
);

/**
 * Start the server
 */
serve(
  {
    ...app,
    port: Number(process.env.PORT) || 3000,
  },
  async (info) => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server started on port ${info.port}`);

    if (mode === "development") {
      const os = await import("node:os");
      const dns = await import("node:dns");
      await new Promise((resolve) => {
        dns.lookup(os.hostname(), 4, (_, address) => {
          // eslint-disable-next-line no-console
          console.log(
            `🌍 http://localhost:${info.port} - http://${
              address || info.address
            }:${info.port}`,
          );

          resolve(null);
        });
      });

      broadcastDevReady(build);
    }
  },
);
