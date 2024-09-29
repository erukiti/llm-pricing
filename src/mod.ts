import {
  convertOpenAIUsage,
  getOpenAIModelSpec,
  type OpenAIUsage,
  type OpenAIModelNames,
} from "./openai";
import {
  convertGoogleUsage,
  getGoogleModelSpec,
  type GoogleUsage,
  type GoogleModelSpec,
} from "./google";
import {
  convertAnthropicUsage,
  getAnthropicModelSpec,
  type AnthropicUsage,
  type AnthropicModelNames,
} from "./anthropic";
import { calcPrice } from "./utils";

export const calcOpenAIPrice = (
  modelName: OpenAIModelNames,
  date: Date,
  openaiUsage: OpenAIUsage,
): number => {
  const usage = convertOpenAIUsage(openaiUsage);
  const modelSpec = getOpenAIModelSpec(modelName, date);
  return calcPrice(usage, modelSpec);
};

export const calcGooglePrice = (
  modelName: GoogleModelSpec,
  date: Date,
  googleUsage: GoogleUsage,
): number => {
  const usage = convertGoogleUsage(googleUsage);
  const modelSpec = getGoogleModelSpec(modelName, date, usage);
  return calcPrice(usage, modelSpec);
};

export const calcAnthropicPrice = (
  modelName: AnthropicModelNames,
  date: Date,
  anthropicUsage: AnthropicUsage,
): number => {
  const usage = convertAnthropicUsage(anthropicUsage);
  const modelSpec = getAnthropicModelSpec(modelName, date);
  return calcPrice(usage, modelSpec);
};
