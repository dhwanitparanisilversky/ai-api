import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AiService } from './ai.service';
import Ajv from 'ajv';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('execute')
  async execute(@Body() body: any) {
    const { task_id, input_text } = body;

    if (!task_id || !input_text) {
      throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
    }

    const raw = await this.aiService.execute(task_id, input_text);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new HttpException(
        'AI returned invalid JSON',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      result: true,
      statusCode: 200,
      message: 'AI execution successful',
      messageLBL: 'SUCCESS',
      payload: parsed,
    };
  }
}
