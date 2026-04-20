import { _decorator } from 'cc';
import { Logger } from './Logger';

void _decorator;

/** 启动错误处理。 */
export class ErrorHandler {
  /** 统一处理错误并记录日志。 */
  public static handle(error: unknown, fallbackMessage: string): string {
    const detail = error instanceof Error ? error.message : String(error);
    Logger.error(fallbackMessage, detail);
    return `${fallbackMessage}: ${detail}`;
  }
}
