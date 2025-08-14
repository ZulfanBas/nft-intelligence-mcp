import { z } from "zod";
import { GetFloorPriceInput } from "../types.js";
import { httpJson } from "../lib/http.js";

type OpenSeaStats = { stats: { floor_price: number | null, seven_day_volume: number } };
type MagicEdenCollection = { floorPrice?: number; symbol?: string }; // floorPrice in lamports (or ME's unit)

export const getFloorPriceTool = {
  name: "getFloorPrice",
  description: "Ambil floor price koleksi NFT dari OpenSea (EVM) atau Magic Eden (Solana)",
  inputSchema: GetFloorPriceInput,
  handler: async (input: z.infer<typeof GetFloorPriceInput>) => {
    const { chain, collectionSlug } = input;

    if (chain === "solana") {
      const apiKey = process.env.MAGICEDEN_API_KEY;
      const url = `https://api-mainnet.magiceden.dev/v2/collections/${encodeURIComponent(collectionSlug)}`;
      const data = await httpJson<MagicEdenCollection>(url, {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined
      });

      const floorLamports = data.floorPrice ?? null;
      if (floorLamports === null) return { content: `Tidak ada floor price untuk ${collectionSlug} di Solana.` };
      // Magic Eden biasanya mengembalikan dalam lamports (1 SOL = 1e9 lamports)
      const floorSOL = floorLamports / 1e9;
      return { content: JSON.stringify({ chain, collection: collectionSlug, floorPrice: { SOL: floorSOL } }, null, 2) };
    }

    // EVM via OpenSea
    const key = process.env.OPENSEA_API_KEY;
    const url = `https://api.opensea.io/api/v1/collection/${encodeURIComponent(collectionSlug)}/stats`;
    const stats = await httpJson<OpenSeaStats>(url, {
      headers: key ? { "X-API-KEY": key } : undefined
    });

    const fp = stats.stats.floor_price;
    return {
      content: JSON.stringify(
        { chain, collection: collectionSlug, floorPrice: fp ? { ETH: fp } : null },
        null,
        2
      )
    };
  }
};
