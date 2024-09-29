import { Decimal } from "decimal.js";
import { isAfter } from "date-fns";
import type { ModelSpec, Usage } from "../types";

// see. https://platform.openai.com/docs/api-reference/chat/object

export type OpenAIUsage = {
  prompt_tokens: number;
  completion_tokens: number;
};

export const OPENAI_MODELS = [
  "gpt-3.5-turbo",
  "gpt-4",
  "gpt-4-32k",
  "gpt-3.5-turbo-16k",
  "gpt-4-turbo-preview",
  "gpt-4-turbo",
  "gpt-4o",
  "gpt-4o-mini",
  "o1-preview",
  "o1-mini",
  "chatgpt-4o-latest",
  "gpt-4o-2024-08-06",
  "gpt-4o-2024-05-13",
  "gpt-4o-mini-2024-07-18",
  "o1-preview-2024-09-12",
  "o1-mini-2024-09-12",
  "gpt-4-1106-preview",
  "gpt-4-0125-preview",
  "gpt-4-vision-preview",
  "gpt-4-turbo-2024-04-09",
  "gpt-4-0613",
  "gpt-4-0314",
  "gpt-4-32k-0314",
  "gpt-4-32k-0613",
  "gpt-3.5-turbo-0301",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo-instruct",
  "gpt-3.5-turbo-16k-0613",
  "davinci-002",
  "babbage-002",
] as const;

export type OpenAIModelNames = (typeof OPENAI_MODELS)[number];

export const convertOpenAIUsage = (
  usage: OpenAIUsage,
): Usage => {
  return {
    inputTokens: usage.prompt_tokens,
    outputTokens: usage.completion_tokens,
  };
};

export const getOpenAIModelSpec = (
  modelName: OpenAIModelNames,
  date: Date,
): ModelSpec => {
  // see. https://openai.com/api/pricing/
  // see. https://platform.openai.com/docs/models/how-we-use-your-data

  const getModelAlias = (modelName: OpenAIModelNames, date: Date): OpenAIModelNames => {
    switch (modelName) {
      case "gpt-3.5-turbo":
        if (isAfter(date, new Date("2024-02-08"))) {
          return "gpt-3.5-turbo-0125";
        }
        // 不明: いつから？？？？？？
        if (isAfter(date, new Date("2023-11-06"))) {
          return "gpt-3.5-turbo-1106";
        }
        if (isAfter(date, new Date("2023-06-27"))) {
          return "gpt-3.5-turbo-0613";
        }
        return "gpt-3.5-turbo-0301";

      case "gpt-4":
        if (isAfter(date, new Date("2023-06-27"))) {
          return "gpt-4-0314";
        }
        return "gpt-4-0613";

      case "gpt-4-32k":
        if (isAfter(date, new Date("2023-06-27"))) {
          return "gpt-4-32k-0613";
        }
        return "gpt-4-32k-0314";

      case "gpt-3.5-turbo-16k":
        return "gpt-3.5-turbo-16k-0613";

      case "gpt-4-turbo-preview":
        return "gpt-4-0125-preview";

      case "gpt-4-turbo":
        return "gpt-4-turbo-2024-04-09";

      case "gpt-4o":
        return "gpt-4o-2024-05-13";

      case "gpt-4o-mini":
        return "gpt-4o-mini-2024-07-18";

      case "o1-preview":
        return "o1-preview-2024-09-12";

      case "o1-mini":
        return "o1-mini-2024-09-12";

      default:
        return modelName;
    }
  };

  switch (getModelAlias(modelName, date)) {
    case "chatgpt-4o-latest":
      return {
        pricePerInputMegaToken: new Decimal("5"),
        pricePerOutputMegaToken: new Decimal("15"),
      };

    case "gpt-4o-2024-08-06":
      return {
        pricePerInputMegaToken: new Decimal("2.5"),
        pricePerOutputMegaToken: new Decimal("10"),
      };

    case "gpt-4o-2024-05-13":
      return {
        pricePerInputMegaToken: new Decimal("5"),
        pricePerOutputMegaToken: new Decimal("15"),
      };

    case "gpt-4o-mini-2024-07-18":
      return {
        pricePerInputMegaToken: new Decimal("0.15"),
        pricePerOutputMegaToken: new Decimal("0.6"),
      };

    case "o1-preview-2024-09-12":
      return {
        pricePerInputMegaToken: new Decimal("15"),
        pricePerOutputMegaToken: new Decimal("60"),
      };

    case "o1-mini-2024-09-12":
      return {
        pricePerInputMegaToken: new Decimal("3"),
        pricePerOutputMegaToken: new Decimal("12"),
      };

    case "gpt-4-1106-preview":
    case "gpt-4-0125-preview":
    case "gpt-4-vision-preview":
    case "gpt-4-turbo-2024-04-09":
      return {
        pricePerInputMegaToken: new Decimal("10"),
        pricePerOutputMegaToken: new Decimal("30"),
      };

    case "gpt-4-0613":
    case "gpt-4-0314":
      return {
        pricePerInputMegaToken: new Decimal("30"),
        pricePerOutputMegaToken: new Decimal("60"),
      };

    case "gpt-4-32k-0314":
    case "gpt-4-32k-0613":
      return {
        pricePerInputMegaToken: new Decimal("60"),
        pricePerOutputMegaToken: new Decimal("120"),
      };

    case "gpt-3.5-turbo-0125":
      return {
        pricePerInputMegaToken: new Decimal("0.5"),
        pricePerOutputMegaToken: new Decimal("1.5"),
      };

    case "gpt-3.5-turbo-instruct":
      return {
        pricePerInputMegaToken: new Decimal("1.5"),
        pricePerOutputMegaToken: new Decimal("2"),
      };

    case "gpt-3.5-turbo-0613":
    case "gpt-3.5-turbo-0301":
      return {
        pricePerInputMegaToken: new Decimal("1.5"),
        pricePerOutputMegaToken: new Decimal("2"),
      };

    case "gpt-3.5-turbo-1106":
      return {
        pricePerInputMegaToken: new Decimal("1"),
        pricePerOutputMegaToken: new Decimal("2"),
      };

    case "gpt-3.5-turbo-16k-0613":
      return {
        pricePerInputMegaToken: new Decimal("3"),
        pricePerOutputMegaToken: new Decimal("4"),
      };

    case "davinci-002":
      return {
        pricePerInputMegaToken: new Decimal("2"),
        pricePerOutputMegaToken: new Decimal("2"),
      };

    case "babbage-002":
      return {
        pricePerInputMegaToken: new Decimal("0.4"),
        pricePerOutputMegaToken: new Decimal("0.4"),
      };

    default:
      throw new Error(`Unknown model name: ${modelName}`);
  }
};
