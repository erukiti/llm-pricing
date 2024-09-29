import { Decimal } from "decimal.js";
import type { ModelSpec, Usage } from "./types";
import {
  getOpenAIModelSpec,
  OPENAI_MODELS,
  type OpenAIModelNames,
} from "./openai";
import {
  getGoogleModelSpec,
  GOOGLE_MODELS,
  type GoogleModelSpec,
} from "./google";
import {
  ANTHROPIC_MODELS,
  getAnthropicModelSpec,
  type AnthropicModelNames,
} from "./anthropic";

export const calcPrice = (usage: Usage, modelSpec: ModelSpec): number => {
  const inputPrice = usage.inputTokens
    ? modelSpec.pricePerInputMegaToken.mul(usage.inputTokens).div(1_000_000)
    : new Decimal(0);
  const outputPrice = usage.outputTokens
    ? modelSpec.pricePerOutputMegaToken.mul(usage.outputTokens).div(1_000_000)
    : new Decimal(0);
  const cacheReadPrice =
    modelSpec.pricePerCacheReadMegaToken && usage.cacheReadTokens
      ? modelSpec.pricePerCacheReadMegaToken
          .mul(usage.cacheReadTokens)
          .div(1_000_000)
      : new Decimal(0);
  const cacheWritePrice =
    modelSpec.pricePerCacheWriteMegaToken && usage.cacheWriteTokens
      ? modelSpec.pricePerCacheWriteMegaToken
          .mul(usage.cacheWriteTokens)
          .div(1_000_000)
      : new Decimal(0);

  return inputPrice
    .add(outputPrice)
    .add(cacheReadPrice)
    .add(cacheWritePrice)
    .toNumber();
};

export type ModelNames =
  | OpenAIModelNames
  | GoogleModelSpec
  | AnthropicModelNames;

export const getModelSpec = (
  modelName: ModelNames,
  date: Date,
  usage: Usage,
): ModelSpec => {
  if (OPENAI_MODELS.includes(modelName as OpenAIModelNames)) {
    return getOpenAIModelSpec(modelName as OpenAIModelNames, date);
  }
  if (GOOGLE_MODELS.includes(modelName as GoogleModelSpec)) {
    return getGoogleModelSpec(modelName as GoogleModelSpec, date, usage);
  }
  if (ANTHROPIC_MODELS.includes(modelName as AnthropicModelNames)) {
    return getAnthropicModelSpec(modelName as AnthropicModelNames, date);
  }

  throw new Error(`Unknown model: ${modelName}`);
};
export const MODELS = [
  ...OPENAI_MODELS,
  ...GOOGLE_MODELS,
  ...ANTHROPIC_MODELS,
] as const;
