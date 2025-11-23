# ChatGPT App MCP Backend for Mofei's Blog

This repository hosts the Cloudflare Workers MCP server that powers the blog app from the article [“How to Build a ChatGPT App From Scratch: MCP Integration, Custom Widgets, and Real API Examples”](https://www.mofei.life/en/blog/article/chatgpt-app). It exposes Mofei's blog APIs as MCP tools so ChatGPT (and any MCP client) can browse posts, fetch details, and surface recommendations.

## What’s inside
- Cloudflare Worker + Durable Object MCP server (`src/index.ts`) with SSE endpoints at `/sse` and `/mcp`.
- Four blog-focused MCP tools: `list-blog-posts`, `get-blog-article`, `get-comment-list`, and `get-recommend-blog`.
- Wrangler configuration (`wrangler.jsonc`) ready for local dev and production deploy.

## Quick start (local)
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. The MCP endpoints are available at `http://localhost:8787/sse` (SSE) and `http://localhost:8787/mcp`.

If you need to expose local dev to ChatGPT, run `ngrok http 8787` (or your tunneling tool) and append `/sse` to the public URL.

## Deploy to Cloudflare Workers
1. Configure your Cloudflare account with Wrangler (`npm create cloudflare@latest` if you need an account setup).
2. Deploy: `npm run deploy`
3. Your public MCP endpoint will be `https://<worker-name>.<your-account>.workers.dev/sse`.

## Connect from ChatGPT (Apps Developer Mode)
1. In ChatGPT: Settings → Apps & Connectors → Advanced settings → Enable “Developer mode”.
2. Create a connection and set “MCP Server URL” to your endpoint:
   - Cloudflare: `https://<worker-name>.<your-account>.workers.dev/sse`
   - Local via ngrok: `https://<random>.ngrok.io/sse`
   - Keep the trailing `/sse`.
3. Test the connection to confirm tools and resources are detected, then save.
4. Try a prompt such as: “Show me the latest posts from Mofei’s blog in English.”

## Available tools
- `list-blog-posts` — Paginated blog list. Params: `page` (number), `lang` (`en`/`zh`).
- `get-blog-article` — Fetch a specific article by `id` and `lang`.
- `get-comment-list` — Retrieve comments with `page` and `pageSize`.
- `get-recommend-blog` — Related articles for a given `id` and `lang`.

Responses return the underlying JSON from `https://api.mofei.life`. For UI widgets, pair this server with the single-file widget bundle described in the blog post (structured content for the model + `_meta` for the widget data).

## Useful scripts
- `npm run dev` — Local dev server on port 8787.
- `npm run deploy` — Deploy to Cloudflare Workers.
- `npm run format` / `npm run lint:fix` — Biome formatting and linting.

## More resources
- Full article: https://www.mofei.life/en/blog/article/chatgpt-app
- ChatGPT Apps SDK docs: https://developers.openai.com/apps-sdk
- MCP spec: https://modelcontextprotocol.io/
