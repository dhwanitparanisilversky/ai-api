import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  async execute(taskId: string, inputText: string): Promise<string> {
    const systemPrompt = `
You must respond ONLY by calling the provided function.
You must not output text.
You must not explain.
You must not add extra fields.
You must return valid JSON only.
`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4.1-mini',
      temperature: 0,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Task ID: ${taskId}\nInput: ${inputText}`,
        },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'structured_response',
            description: 'Return structured execution output',
            parameters: {
              type: 'object',
              properties: {
                task_id: { type: 'string' },
                summary: { type: 'string' },
                status: {
                  type: 'string',
                  enum: ['success', 'failure'],
                },
              },
              required: ['task_id', 'summary', 'status'],
            },
          },
        },
      ],
      tool_choice: {
        type: 'function',
        function: { name: 'structured_response' },
      },
    });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];

    if (!toolCall || toolCall.type !== 'function') {
      throw new Error('No function tool call returned by AI');
    }

    return toolCall.function.arguments;
  }
}
