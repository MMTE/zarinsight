import { defineAgent } from 'eve';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import type { LanguageModelV4 } from '@ai-sdk/provider';
import { FallbackModel } from './lib/model-chain';

// Provider routing (ADR-0011/0013 — liara pattern): CHAT_PROVIDER selects a
// provider family; an ordered fallback chain serves every call and a provider
// that errors (auth, quota, network, 5xx) is benched for 5 minutes.
// Configure explicitly with CHAT_MODEL_CHAIN="provider:model,provider:model,…"
// — otherwise a default chain is derived from CHAT_PROVIDER/CHAT_MODEL and
// the keys present. With NO provider env at all, the gateway model string
// stays (judges' zero-config path from Task 7).
const provider = process.env.CHAT_PROVIDER || '';
const chatModel = process.env.CHAT_MODEL || undefined;

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

/** Model factories per provider; an entry without its env keys yields
 *  undefined and is skipped. `modelId` overrides the per-provider default
 *  (used by CHAT_MODEL_CHAIN entries like `avalai:deepseek-v4-pro`). */
const registry: Record<string, (modelId?: string) => LanguageModelV4 | undefined> = {
  avalai: (modelId) => {
    const key = env('AVALAI_API_KEY');
    if (!key) return undefined;
    const c = createOpenAICompatible({
      name: 'avalai',
      baseURL: env('AVALAI_BASE_URL') ?? 'https://api.avalai.ir/v1',
      apiKey: key,
    });
    return c.chatModel(modelId ?? chatModel ?? 'deepseek-v4-flash');
  },
  liara: (modelId) => {
    const key = env('LIARA_AI_API_KEY');
    const ws = env('LIARA_AI_WORKSPACE_ID');
    if (!key || !ws) return undefined;
    const c = createOpenAICompatible({
      name: 'liara-ai',
      baseURL: env('LIARA_AI_BASE_URL') ?? `https://ai.liara.ir/api/${ws}/v1`,
      apiKey: key,
    });
    return c.chatModel(modelId ?? chatModel ?? 'openai/gpt-4.1-mini');
  },
  openrouter: (modelId) => {
    const key = env('OPENROUTER_API_KEY');
    if (!key) return undefined;
    const c = createOpenAICompatible({
      name: 'openrouter',
      baseURL: env('OPENROUTER_BASE') ?? 'https://openrouter.ai/api/v1',
      apiKey: key,
    });
    return c.chatModel(modelId ?? chatModel ?? 'deepseek/deepseek-chat-v3.1');
  },
  openai: (modelId) => {
    const key = env('OPENAI_API_KEY');
    if (!key) return undefined;
    const c = createOpenAICompatible({
      name: 'openai-compatible',
      baseURL: env('OPENAI_BASE_URL') ?? 'https://api.openai.com/v1',
      apiKey: key,
    });
    return c.chatModel(modelId ?? chatModel ?? 'gpt-4o-mini');
  },
};

/** default chains per CHAT_PROVIDER — cheap first, stronger fallbacks */
function defaultChain(): string[] {
  switch (provider) {
    case 'liara':
      return ['liara', 'avalai'];
    case 'openrouter':
      return ['openrouter', 'avalai'];
    case 'openai':
      return ['openai', 'avalai'];
    default:
      return ['avalai', 'liara'];
  }
}

function resolveChain(): string[] {
  const raw = env('CHAT_MODEL_CHAIN');
  if (raw) return raw.split(',').map((s) => s.trim()).filter(Boolean);
  return defaultChain();
}

function resolveModel(): string | LanguageModelV4 {
  // No provider configured → plain gateway model id (carries catalog
  // metadata; works with an ambient gateway key and no extra setup).
  if (!provider) return chatModel ?? 'zai/glm-5.2';

  const models: LanguageModelV4[] = [];
  const ids: string[] = [];
  for (const entry of resolveChain()) {
    const sep = entry.indexOf(':');
    const name = sep === -1 ? entry : entry.slice(0, sep);
    const modelOverride = sep === -1 ? undefined : entry.slice(sep + 1);
    const build = registry[name];
    if (!build) {
      console.warn(`[model-chain] unknown provider "${name}" in chain — skipped`);
      continue;
    }
    const model = build(modelOverride);
    if (model) {
      models.push(model);
      ids.push(entry);
    } else {
      console.warn(`[model-chain] ${name} unavailable (missing keys) — skipped`);
    }
  }
  if (models.length === 0) {
    // Degrade to the gateway default instead of refusing to boot: the UI
    // falls back to FAQ templates only when the whole agent is down.
    console.warn(`[model-chain] no usable provider in chain (CHAT_PROVIDER=${provider}) — gateway default`);
    return chatModel ?? 'zai/glm-5.2';
  }
  console.log(`[model-chain] ${ids.join(' → ')}`);
  return models.length === 1
    ? models[0]!
    : new FallbackModel(models, { ids, log: (m) => console.log(m) });
}

const model = resolveModel();

export default defineAgent({
  model,
  // Provider-object models lack Gateway catalog metadata; declare a
  // conservative context window so compaction can plan.
  ...(typeof model !== 'string' ? { modelContextWindowTokens: 128_000 } : {}),
  limits: {
    // Cost guardrails (ADR-0011 §4).
    maxInputTokensPerSession: 2_000_000,
    maxOutputTokensPerSession: 200_000,
  },
});
