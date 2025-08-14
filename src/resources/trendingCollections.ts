import { httpJson } from "../lib/http.js";

export const trendingCollectionsResource = {
  uri: "nft:trending",
  name: "Trending NFT Collections (OpenSea top few)",
  read: async () => {
    const key = process.env.OPENSEA_API_KEY;
    // OpenSea v1 example; adjust endpoint to latest "collections" discovery if needed
    const url = `https://api.opensea.io/api/v1/collections?offset=0&limit=10`;
    const data = await httpJson<any>(url, { headers: key ? { "X-API-KEY": key } : undefined });
    return {
      mimeType: "application/json",
      content: JSON.stringify(data, null, 2)
    };
  }
};
