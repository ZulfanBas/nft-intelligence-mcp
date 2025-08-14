#!/usr/bin/env node
import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/stdio";
import {
  getFloorPriceTool,
  getRecentSalesTool,
  getNFTMetadataTool,
  getNFTRarityTool,
  alertFloorPriceTool,
  cancelAlertTool
} from "./tools/index.js";
import { trendingCollectionsResource, analyticsResource } from "./resources/index.js";

async function main() {
  const server = new Server(
    {
      name: "nft-intelligence-mcp",
      version: "0.1.0",
      tools: [
        getFloorPriceTool,
        getRecentSalesTool,
        getNFTMetadataTool,
        getNFTRarityTool,
        alertFloorPriceTool,
        cancelAlertTool,
        getFloorListingsTool
      ],
      resources: [
        trendingCollectionsResource,
        analyticsResource
      ]
    },
    new StdioServerTransport()
  );

  await server.start();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
