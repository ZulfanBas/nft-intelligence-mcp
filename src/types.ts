import { z } from "zod";

export const Chain = z.enum(["ethereum", "polygon", "solana"]);
export type Chain = z.infer<typeof Chain>;

export const GetFloorPriceInput = z.object({
  chain: Chain.default("ethereum"),
  collectionSlug: z.string().min(1).describe("Slug koleksi (OpenSea/Magic Eden)")
});

export const GetRecentSalesInput = z.object({
  chain: Chain.default("ethereum"),
  collectionSlug: z.string().min(1),
  limit: z.number().int().min(1).max(50).default(10)
});

export const GetNFTMetadataInput = z.object({
  chain: Chain.default("ethereum"),
  contractAddress: z.string().min(4).describe("Alamat kontrak (EVM) atau mint address (Solana)"),
  tokenId: z.string().min(1).describe("Token ID (EVM) atau mint address (Solana)")
});

export const GetNFTRarityInput = z.object({
  provider: z.enum(["traitsni­per", "raritysniper"]).default("raritysniper"),
  collectionSlug: z.string().min(1),
  tokenId: z.string().min(1)
});

export const AlertFloorPriceInput = z.object({
  chain: Chain.default("ethereum"),
  collectionSlug: z.string().min(1),
  direction: z.enum(["above", "below"]).default("below"),
  targetPrice: z.number().positive(),
  intervalSec: z.number().int().min(10).max(3600).default(60)
});

export const CancelAlertInput = z.object({
  subscriptionId: z.string().min(1)
});
