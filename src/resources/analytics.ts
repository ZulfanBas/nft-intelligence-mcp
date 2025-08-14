import { httpJson } from "../lib/http.js";

export const analyticsResource = {
  uri: "nft:analytics",
  name: "Simple analytics helper (OpenSea stats schema)",
  read: async () => {
    // contoh payload dokumentatif; resource ini bisa diubah jadi dynamic bila diberi query params via tool
    const example = {
      summary: "Resource ini memberi contoh analitik sederhana untuk satu koleksi via OpenSea stats.",
      howToUse: "Panggil tool getFloorPrice/getRecentSales untuk koleksi spesifik; gabungkan di sisi AI.",
      schema: {
        fields: ["floor_price", "seven_day_volume", "thirty_day_volume", "num_owners", "count"],
        source: "OpenSea / Magic Eden"
      }
    };
    return {
      mimeType: "application/json",
      content: JSON.stringify(example, null, 2)
    };
  }
};
