import { z } from "zod";
import { GetNFTRarityInput } from "../types.js";
import { httpJson } from "../lib/http.js";

export const getNFTRarityTool = {
  name: "getNFTRarity",
  description: "Ambil rarity rank NFT dari penyedia pihak ketiga (TraitSniper/RaritySniper)",
  inputSchema: GetNFTRarityInput,
  handler: async (input: z.infer<typeof GetNFTRarityInput>) => {
    const { provider, collectionSlug, tokenId } = input;

    if (provider === "traitsni­per") {
      const key = process.env.TRAITSNIPER_API_KEY;
      if (!key) return { content: "Butuh TRAITSNIPER_API_KEY" };
      const url = `https://api.traitsniper.com/v1/collections/${encodeURIComponent(collectionSlug)}/tokens/${encodeURIComponent(tokenId)}`;
      const data = await httpJson<any>(url, { headers: { Authorization: `Bearer ${key}` } });
      return { content: JSON.stringify({ provider, rarity: data }, null, 2) };
    }

    // default: raritysniper
    const key = process.env.RARITYSNIPER_API_KEY;
    if (!key) return { content: "Butuh RARITYSNIPER_API_KEY" };
    const url = `https://api.raritysniper.com/collections/${encodeURIComponent(collectionSlug)}/tokens/${encodeURIComponent(tokenId)}`;
    const data = await httpJson<any>(url, { headers: { Authorization: `Bearer ${key}` } });
    return { content: JSON.stringify({ provider: "raritysniper", rarity: data }, null, 2) };
  }
};
