import type { Decimal } from "decimal.js";

export type Usage = {
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
};

export type ModelSpec = {
  pricePerInputMegaToken: Decimal;
  pricePerOutputMegaToken: Decimal;
  pricePerCacheReadMegaToken?: Decimal;
  pricePerCacheWriteMegaToken?: Decimal;
};
