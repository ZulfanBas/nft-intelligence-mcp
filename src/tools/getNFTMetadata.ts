import { z } from "zod";
import { GetNFTMetadataInput } from "../types.js";
import { httpJson } from "../lib/http.js";

export const getNFTMetadataTool = {
  name: "getNFTMetadata",
  description: "Ambil metadata NFT (EVM via OpenSea; Solana via Magic Eden/Helius bila tersedia)",
  inputSchema: GetNFTMetadataInput,
  handler: async (input: z.infer<typeof GetNFTMetadataInput>) => {
    const { chain, contractAddress, tokenId } = input;

    if (chain === "solana") {
      // Try Magic Eden token
      const meKey = process.env.MAGICEDEN_API_KEY;
      const url = `https://api-mainnet.magiceden.dev/v2/tokens/${encodeURIComponent(tokenId)}`;
      try {
        const meta = await httpJson<any>(url, {
          headers: meKey ? { Authorization: `Bearer ${meKey}` } : undefined
        });
        return { content: JSON.stringify({ chain, metadata: meta }, null, 2) };
      } catch {
        // fallback: Helius (if provided)
        const helius = process.env.HELIUS_API_KEY;
        if (!helius) {
          return { content: "Metadata Solana tidak tersedia (butuh MAGICEDEN_API_KEY atau HELIUS_API_KEY)." };
        }
        const hUrl = `https://mainnet.helius-rpc.com/?api-key=${helius}`;
        const body = {
          jsonrpc: "2.0",
          id: "1",
          method: "getAsset",
          params: { id: tokenId }
        };
        const res = await fetch(hUrl, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" }});
        if (!res.ok) throw new Error("Helius getAsset gagal");
        const json = await res.json();
        return { content: JSON.stringify({ chain, metadata: json?.result }, null, 2) };
      }
    }

    // EVM via OpenSea
    const key = process.env.OPENSEA_API_KEY;
    const url = `https://api.opensea.io/api/v1/asset/${encodeURIComponent(contractAddress)}/${encodeURIComponent(tokenId)}`;
    const asset = await httpJson<any>(url, {
      headers: key ? { "X-API-KEY": key } : undefined
    });
    return { content: JSON.stringify({ chain, metadata: asset }, null, 2) };
  }
};
