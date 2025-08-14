import { z } from "zod";
import { GetRecentSalesInput } from "../types.js";
import { httpJson } from "../lib/http.js";

type OpenSeaSale = {
  event_timestamp?: string;
  payment_symbol?: string;
  total_price?: string;
  transaction?: { hash?: string };
  asset?: { token_id?: string };
};
type OpenSeaEvents = { asset_events?: OpenSeaSale[] };

type MagicEdenSale = {
  blockTime?: number;
  price?: number; // in SOL
  buyer?: string;
  seller?: string;
  tokenMint?: string;
  signature?: string;
};

export const getRecentSalesTool = {
  name: "getRecentSales",
  description: "Transaksi terbaru dari koleksi NFT",
  inputSchema: GetRecentSalesInput,
  handler: async (input: z.infer<typeof GetRecentSalesInput>) => {
    const { chain, collectionSlug, limit } = input;

    if (chain === "solana") {
      // Magic Eden activities (sales)
      const apiKey = process.env.MAGICEDEN_API_KEY;
      const url = `https://api-mainnet.magiceden.dev/v2/collections/${encodeURIComponent(
        collectionSlug
      )}/activities?offset=0&limit=${limit}&filter=sold`;
      const rows = await httpJson<MagicEdenSale[]>(url, {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined
      });

      const mapped = rows.map(r => ({
        chain,
        time: r.blockTime ? new Date(r.blockTime * 1000).toISOString() : null,
        price: r.price ? { SOL: r.price } : null,
        buyer: r.buyer,
        seller: r.seller,
        tokenMint: r.tokenMint,
        txSignature: r.signature
      }));

      return { content: JSON.stringify(mapped, null, 2) };
    }

    // EVM: OpenSea events (note: v1 events may be deprecated; adjust per latest docs)
    const key = process.env.OPENSEA_API_KEY;
    const url = `https://api.opensea.io/api/v1/events?only_opensea=false&offset=0&limit=${limit}&collection_slug=${encodeURIComponent(
      collectionSlug
    )}&event_type=successful`;

    const data = await httpJson<OpenSeaEvents>(url, {
      headers: key ? { "X-API-KEY": key } : undefined
    });

    const events = data.asset_events ?? [];
    const mapped = events.map(e => ({
      chain,
      time: e.event_timestamp ?? null,
      price: e.total_price ? { RAW: e.total_price, SYMBOL: e.payment_symbol ?? "ETH" } : null,
      txHash: e.transaction?.hash ?? null,
      tokenId: e.asset?.token_id ?? null
    }));

    return { content: JSON.stringify(mapped, null, 2) };
  }
};
