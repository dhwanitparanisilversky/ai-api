import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { TASK_REGISTRY } from '../tasks/task.registry';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('execute')
  async execute(@Body() body: any) {
    const { task_id, input_text } = body;

    if (!task_id || !input_text || typeof input_text !== 'string' || input_text.length === 0) {
      throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
    }

    if( input_text === ' '){
      throw new BadRequestException({ error: 'EMPTY_INPUT_TEXT', message: 'whitespaces are not allowed' });
    }

    const task = TASK_REGISTRY[task_id];

    if (!task) {
      throw new BadRequestException({ error: 'INVALID_TASK_ID', message: 'task_id is not supported' });
    }

    const raw = await this.aiService.execute(input_text, task);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new HttpException(
        'AI response schema validation failed',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      result: true,
      statusCode: 200,
      message: 'AI execution successful',
      messageLBL: 'SUCCESS',
      payload: { task_id, ...parsed },
    };
  }
}
