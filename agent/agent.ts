import { defineAgent } from 'eve';

// Model selection per ADR-0011 (liara precedent): CHAT_MODEL overrides; the
// default gateway model keeps the agent runnable for judges; UI falls back to
// deterministic FAQ templates when no provider key is configured.
const chatModel = process.env.CHAT_MODEL ?? 'zai/glm-5.2';

export default defineAgent({
  model: chatModel,
  limits: {
    maxInputTokensPerSession: 2_000_000,
    maxOutputTokensPerSession: 200_000,
  },
});
