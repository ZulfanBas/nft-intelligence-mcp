import fetch from "node-fetch";
import { z } from "zod";

export const getFloorListingsTool = {
  name: "getFloorListings",
  description: "Ambil daftar NFT di harga lantai (floor listings) dari OpenSea",
  inputSchema: z.object({
    collectionSlug: z.string().describe("Slug koleksi di OpenSea"),
    limit: z.number().default(5).describe("Jumlah listing terendah yang diambil")
  }),
  handler: async ({ collectionSlug, limit }) => {
    const url = `https://api.opensea.io/v2/listings/collection/${collectionSlug}?limit=${limit}&order_by=price&order_direction=asc`;
    
    const res = await fetch(url, {
      headers: {
        "X-API-KEY": process.env.OPENSEA_API_KEY
      }
    });
    
    if (!res.ok) throw new Error(`Gagal ambil floor listings: ${res.statusText}`);
    
    const data = await res.json();

    const listings = data.listings.map((item: any) => ({
      tokenId: item.asset?.token_id,
      price: item.price?.current?.eth ?? "N/A",
      seller: item.seller?.address ?? "Unknown",
      url: item.asset?.permalink
    }));

    return {
      content: `Floor Listings untuk ${collectionSlug}:\n` +
               listings.map(l => `#${l.tokenId} - ${l.price} ETH - ${l.url}`).join("\n")
    };
  }
};
