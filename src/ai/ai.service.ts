import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { TaskDefinition } from '../tasks/task.registry';

@Injectable()
export class AiService {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async execute(inputText: string, taskdef: TaskDefinition): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4.1-mini',
      temperature: 0,
      messages: [
        { role: 'system', content: taskdef.systemPrompt },
        {
          role: 'user',
          content: inputText,
        },
      ],
      tools: [
        {
          type: 'function',
          function: taskdef.toolSchema
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
