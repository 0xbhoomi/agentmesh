import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const AGENT_MESH_URL = process.env.AGENT_MESH_URL || "http://localhost:3001/agentmesh";

const server = new Server(
  {
    name: "agentmesh-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "pay_service",
        description: "Call a paid agent service through AgentMesh. This handles discovery, routing, and Stellar payment.",
        inputSchema: {
          type: "object",
          properties: {
            service: { type: "string", description: "Category of service (e.g., search, news)" },
            intent: { type: "string", description: "What you want the service to do" },
            priority: { type: "string", enum: ["cheap", "fast", "balanced"], default: "balanced" },
            agent_id: { type: "string", description: "Your agent identifier" },
            max_price_usdc: { type: "string", description: "Max price you're willing to pay in USDC" },
          },
          required: ["service", "intent", "agent_id"],
        },
      },
      {
        name: "list_work",
        description: "List your completed work as a new service in the AgentMesh Bazaar to start earning USDC.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of your service" },
            category: { type: "string", description: "Service category" },
            price: { type: "string", description: "Price in USDC" },
            endpoint: { type: "string", description: "Your API endpoint" },
            provider_id: { type: "string", description: "Your provider identifier" },
          },
          required: ["name", "category", "price", "endpoint", "provider_id"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "pay_service") {
      const response = await axios.post(`${AGENT_MESH_URL}/pay`, args);
      return {
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
      };
    }

    if (name === "list_work") {
      const response = await axios.post(`${AGENT_MESH_URL}/list`, args);
      return {
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error calling AgentMesh: ${error.message}` }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AgentMesh MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
