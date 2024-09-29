import { Decimal } from "decimal.js";
import { isAfter } from "date-fns";
import type { ModelSpec, Usage } from "../types";

// see. https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/control-generated-output?hl=ja

export type GoogleUsage = {
  prompt_token_count: number;
  candidates_token_count: number;
};

export const GOOGLE_MODELS = [
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.0-pro",
  "gemini-1.0-flash",
  "gemini-1.5-pro-001",
  "gemini-1.5-flash-001",
  "gemini-1.5-pro-002",
  "gemini-1.5-flash-002",
] as const;

export type GoogleModelSpec = (typeof GOOGLE_MODELS)[number];

export const convertGoogleUsage = (
  usage: GoogleUsage,
): Usage => {
  return {
    inputTokens: usage.prompt_token_count,
    outputTokens: usage.candidates_token_count,
  };
};

export const getGoogleModelSpec = (
  modelName: GoogleModelSpec,
  date: Date,
  usage: Usage,
): ModelSpec => {
  // see. https://cloud.google.com/vertex-ai/generative-ai/pricing?hl=ja
  // see. https://developers.googleblog.com/en/updated-production-ready-gemini-models-reduced-15-pro-pricing-increased-rate-limits-and-more/

  const getModelAlias = (
    modelName: GoogleModelSpec,
    date: Date,
  ): GoogleModelSpec => {
    switch (modelName) {
      case "gemini-1.5-pro":
        // 2024-10-01以後
        if (isAfter(date, new Date("2024-10-01"))) {
          return "gemini-1.5-pro-002";
        }
        return "gemini-1.5-pro-001";
      case "gemini-1.5-flash":
        if (isAfter(date, new Date("2024-10-01"))) {
          return "gemini-1.5-flash-002";
        }
        return "gemini-1.5-flash-001";
      default:
        return modelName;
    }
  };

  const isMinimum128k = !usage.inputTokens || usage.inputTokens <= 128_000;

  switch (getModelAlias(modelName, date)) {
    case "gemini-1.5-pro-002":
      if (isMinimum128k) {
        return {
          pricePerInputMegaToken: new Decimal("1.25"),
          pricePerOutputMegaToken: new Decimal("2.5"),
        };
      }
      return {
        pricePerInputMegaToken: new Decimal("5"),
        pricePerOutputMegaToken: new Decimal("10"),
      };

    case "gemini-1.5-flash-002":
      if (isMinimum128k) {
        return {
          pricePerInputMegaToken: new Decimal("0.01875"),
          pricePerOutputMegaToken: new Decimal("0.075"),
        };
      }
      return {
        pricePerInputMegaToken: new Decimal("0.0375"),
        pricePerOutputMegaToken: new Decimal("0.15"),
      };

    case "gemini-1.5-pro-001":
      if (isMinimum128k) {
        return {
          pricePerInputMegaToken: new Decimal("3.5"),
          pricePerOutputMegaToken: new Decimal("10.5"),
        };
      }
      return {
        pricePerInputMegaToken: new Decimal("7"),
        pricePerOutputMegaToken: new Decimal("21"),
      };

    case "gemini-1.5-flash-001":
      if (isMinimum128k) {
        return {
          pricePerInputMegaToken: new Decimal("0.01875"),
          pricePerOutputMegaToken: new Decimal("0.075"),
        };
      }
      return {
        pricePerInputMegaToken: new Decimal("0.0375"),
        pricePerOutputMegaToken: new Decimal("0.15"),
      };

    case "gemini-1.0-pro":
      return {
        pricePerInputMegaToken: new Decimal("0.125"),
        pricePerOutputMegaToken: new Decimal("0.375"),
      };

    default:
      throw new Error(`Unknown model name: ${modelName}`);
  }
};
