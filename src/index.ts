import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "Mofei Blog Agent",
    version: "1.0.0",
    description:
      "An MCP server that exposes Mofei's blog APIs for searching and retrieving blog content.",
  });

  async init() {
    // get blog post
    this.server.tool(
      "list-blog-posts",
      {
        page: z.number().describe("The page number to retrieve"),
        lang: z.string().describe("Language code, e.g. 'en' or 'zh'"),
      },
      async ({ page, lang }) => {
        const url = `https://api.mofei.life/api/blog/list/${page}?lang=${lang}`;
        const res = await fetch(url);
        const data = await res.json();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data),
            },
          ],
        };
      }
    );

    this.server.tool(
      "get-blog-article",
      {
        id: z
          .string()
          .describe("ID of the blog article, e.g. '665ad9f8136fb3b8b96dd685'"),
        lang: z
          .enum(["en", "zh"])
          .default("en")
          .describe("Language code: 'en' or 'zh'"),
      },
      async ({ id, lang }) => {
        const res = await fetch(
          `https://api.mofei.life/api/blog/article/${id}?lang=${lang}`
        );
        const data = await res.json();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data),
            },
          ],
        };
      }
    );

    this.server.tool(
      "get-comment-list",
      {
        page: z.string().default("1"),
        pageSize: z.string().default("20"),
      },
      async ({ page, pageSize }) => {
        const res = await fetch(
          `https://api.mofei.life/api/blog/comment_list/${page}?pageSize=${pageSize}`
        );
        const data = await res.json();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data),
            },
          ],
        };
      }
    );

    this.server.tool(
      "get-recommend-blog",
      {
        id: z
          .string()
          .describe("ID of the blog article, e.g. '665ad9f8136fb3b8b96dd685'"),
        lang: z
          .enum(["en", "zh"])
          .default("en")
          .describe("Language code: 'en' or 'zh'"),
      },
      async ({ id, lang }) => {
        const res = await fetch(
          `https://api.mofei.life/api/blog/recommend/${id}?lang=${lang}`
        );
        const data = await res.json();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data),
            },
          ],
        };
      }
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      // @ts-ignore
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      // @ts-ignore
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
