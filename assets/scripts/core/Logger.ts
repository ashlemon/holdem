import { _decorator } from 'cc';

void _decorator;

/** 日志工具。 */
export class Logger {
  /** 输出调试日志。 */
  public static info(message: string, ...args: unknown[]): void {
    console.info(`[Holdem] ${message}`, ...args);
  }

  /** 输出警告日志。 */
  public static warn(message: string, ...args: unknown[]): void {
    console.warn(`[Holdem] ${message}`, ...args);
  }

  /** 输出错误日志。 */
  public static error(message: string, ...args: unknown[]): void {
    console.error(`[Holdem] ${message}`, ...args);
  }
}
