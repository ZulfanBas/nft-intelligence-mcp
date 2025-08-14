import { z } from "zod";
import { AlertFloorPriceInput, CancelAlertInput } from "../types.js";
import { getFloorPriceTool } from "./getFloorPrice.js";

// in-memory subscriptions
const subs = new Map<string, NodeJS.Timeout>();

export const alertFloorPriceTool = {
  name: "alertFloorPrice",
  description: "Buat alert jika floor price melewati target (in-memory, polling)",
  inputSchema: AlertFloorPriceInput,
  handler: async (input: z.infer<typeof AlertFloorPriceInput>) => {
    const id = `${input.chain}:${input.collectionSlug}:${Date.now()}:${Math.random().toString(36).slice(2)}`;

    const tick = async () => {
      try {
        const res = await getFloorPriceTool.handler({ chain: input.chain, collectionSlug: input.collectionSlug } as any);
        const parsed = safeJson(res.content);
        const price = parsed?.floorPrice?.ETH ?? parsed?.floorPrice?.SOL ?? null;
        if (typeof price === "number") {
          const hit = input.direction === "above" ? price >= input.targetPrice : price <= input.targetPrice;
          if (hit) {
            console.log(JSON.stringify({
              type: "alert",
              subscriptionId: id,
              message: `Floor ${input.collectionSlug} ${input.direction} ${input.targetPrice}`,
              price
            }));
            // one-shot: clear
            const t = subs.get(id);
            if (t) clearInterval(t);
            subs.delete(id);
          }
        }
      } catch (e) {
        // swallow errors, keep polling
      }
    };

    const timer = setInterval(tick, input.intervalSec * 1000);
    subs.set(id, timer);
    // kick first check
    void tick();

    return { content: JSON.stringify({ subscriptionId: id, status: "subscribed" }, null, 2) };
  }
};

export const cancelAlertTool = {
  name: "cancelAlert",
  description: "Batalkan alertFloorPrice dengan subscriptionId",
  inputSchema: CancelAlertInput,
  handler: async (input: z.infer<typeof CancelAlertInput>) => {
    const t = subs.get(input.subscriptionId);
    if (!t) return { content: JSON.stringify({ subscriptionId: input.subscriptionId, status: "not_found" }) };
    clearInterval(t);
    subs.delete(input.subscriptionId);
    return { content: JSON.stringify({ subscriptionId: input.subscriptionId, status: "canceled" }) };
  }
};

function safeJson(s: any) {
  try { return typeof s === "string" ? JSON.parse(s) : s; } catch { return null; }
}
