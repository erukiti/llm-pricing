import { Decimal } from "decimal.js";
import type { ModelSpec, Usage } from "../types";

// see. https://docs.anthropic.com/ja/api/messages
export type AnthropicUsage = {
  input_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
  output_tokens: number;
};

export const ANTHROPIC_MODELS = [
  "claude-3-5-sonnet",
  "claude-3-sonnet",
  "claude-3-opus",
  "claude-3-haiku",
  "claude-2.1",
  "claude-2.0",
  "claude-instant-1.2",
  "claude-3-opus-20240229",
  "claude-3-5-sonnet-20240620",
  "claude-3-sonnet-20240229",
  "claude-3-haiku-20240307",
  "anthropic.claude-3-opus-20240229-v1:0",
  "anthropic.claude-3-5-sonnet-20240620-v1:0",
  "anthropic.claude-3-sonnet-20240229-v1:0",
  "anthropic.claude-3-haiku-20240307-v1:0",
  "claude-3-opus@20240229",
  "claude-3-5-sonnet@20240620",
  "claude-3-sonnet@20240229",
  "claude-3-haiku@20240307",

] as const;

export type AnthropicModelNames = (typeof ANTHROPIC_MODELS)[number];

export const convertAnthropicUsage = (
  usage: AnthropicUsage,
): Usage => {
  return {
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    cacheReadTokens: usage.cache_read_input_tokens,
    cacheWriteTokens: usage.cache_creation_input_tokens,
  };
};

export const getAnthropicModelSpec = (
  modelName: AnthropicModelNames,
  date: Date,
): ModelSpec => {
  // see. https://www.anthropic.com/pricing#anthropic-api

  const getModelAlias = (
    modelName: AnthropicModelNames,
    date: Date,
  ): AnthropicModelNames => {
    // see. https://docs.anthropic.com/en/docs/about-claude/models
    switch (modelName) {
      case "claude-3-5-sonnet":
        return "claude-3-5-sonnet-20240620";
      case "claude-3-sonnet":
        return "claude-3-sonnet-20240229";
      case "claude-3-opus":
        return "claude-3-opus-20240229";
      case "claude-3-haiku":
        return "claude-3-haiku-20240307";

      default:
        return modelName;
    }
  };

  switch (getModelAlias(modelName, date)) {
    case "claude-3-opus-20240229":
    case "anthropic.claude-3-opus-20240229-v1:0":
    case "claude-3-opus@20240229":
      return {
        pricePerInputMegaToken: new Decimal("15"),
        pricePerOutputMegaToken: new Decimal("75"),
        pricePerCacheWriteMegaToken: new Decimal("18.75"),
        pricePerCacheReadMegaToken: new Decimal("1.5"),
      };

    case "claude-3-5-sonnet-20240620":
    case "anthropic.claude-3-5-sonnet-20240620-v1:0":
    case "claude-3-5-sonnet@20240620":
      return {
        pricePerInputMegaToken: new Decimal("3"),
        pricePerOutputMegaToken: new Decimal("15"),
        pricePerCacheWriteMegaToken: new Decimal("3.75"),
        pricePerCacheReadMegaToken: new Decimal("0.3"),
      };

    case "claude-3-sonnet-20240229":
    case "anthropic.claude-3-sonnet-20240229-v1:0":
    case "claude-3-sonnet@20240229":
      return {
        pricePerInputMegaToken: new Decimal("3"),
        pricePerOutputMegaToken: new Decimal("15"),
        pricePerCacheWriteMegaToken: new Decimal("3.75"),
        pricePerCacheReadMegaToken: new Decimal("0.3"),
      };

    case "claude-3-haiku-20240307":
    case "anthropic.claude-3-haiku-20240307-v1:0":
    case "claude-3-haiku@20240307":
      return {
        pricePerInputMegaToken: new Decimal("0.25"),
        pricePerOutputMegaToken: new Decimal("1.25"),
        pricePerCacheWriteMegaToken: new Decimal("0.3"),
        pricePerCacheReadMegaToken: new Decimal("0.03"),
      };

    case "claude-2.1":
      return {
        pricePerInputMegaToken: new Decimal("8"),
        pricePerOutputMegaToken: new Decimal("24"),
      };

    case "claude-2.0":
      return {
        pricePerInputMegaToken: new Decimal("8"),
        pricePerOutputMegaToken: new Decimal("24"),
      };

    case "claude-instant-1.2":
      return {
        pricePerInputMegaToken: new Decimal("0.8"),
        pricePerOutputMegaToken: new Decimal("2.4"),
      };
    default:
      throw new Error(`Unknown model: ${modelName}`);
  }
};
