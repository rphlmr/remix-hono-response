# How to

```bash
npm run dev
```

## Demo
Go to `/`, with any `console.log` uncommented, you should see that `Suspense` is working.

Now you can try to uncomment `console.log` that access `res.status`.

## Console log / reproduce

- You can quickly reproduce the log traces by uncommenting console.log in [`app/entry.server.tsx`](app/entry.server.tsx) L119.
- [`server/handler.ts`](`server/handler.ts`) L26 This is an extract of Remix Hono handler


### NB
[`logger`](server/middlewares.ts) if a copy of Hono's logger with a 'patch'
