export type TaskDefinition = {
  systemPrompt: string;
  toolSchema: any;
};

const systemPromptSummarize = `
You must respond ONLY by calling the provided function.
You must not output text.
You must not explain.
You must not add extra fields.
You must return valid JSON only.`

const systemPromptClassify = `
You must classify the input text.
Respond ONLY using the provided function.
Return valid JSON only.
`;

export const TASK_REGISTRY: Record<string, TaskDefinition> = {
  TASK_SUMMARIZE_V1: {
    systemPrompt: systemPromptSummarize,
    toolSchema: {
      name: "structured_response",
      description: "Return structured execution output",
      parameters: {
        type: "object",
        properties: {
          summary: { type: "string" },
          status: {
            type: "string",
            enum: ["success", "failure"]
          }
        },
        required: ["summary", "status"],
        additionalProperties: false
      }
    }
  },

  TASK_CLASSIFY_V1: {
    systemPrompt: systemPromptClassify,
    toolSchema: {
      name: "structured_response",
      description: "Return classification result",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string" },
          // summary: { type: "string" },
          status: {
            type: "string",
            enum: ["success", "failure"]
          }
        },
        required: ["category", "status"],
        additionalProperties: false
      }
    }
  }
};
