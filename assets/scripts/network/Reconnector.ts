import { _decorator } from 'cc';
import { MsgId } from '../constants/MsgId';
import { EventBus } from '../core/EventBus';
import { Logger } from '../core/Logger';

void _decorator;

/** 重连上下文。 */
export interface ReconnectContext {
  session_token: string;
  last_seq: number;
  table_id: string;
}

/** 重连器。 */
export class Reconnector {
  private attempt = 0;
  private reconnecting = false;

  public constructor(
    private readonly eventBus: EventBus,
    private readonly connect: () => Promise<void>,
    private readonly sendReconnectReq: (msgId: MsgId, payload: ReconnectContext) => Promise<void>,
    private readonly getContext: () => ReconnectContext,
    private readonly maxAttempts = 10
  ) {}

  /** 处理连接断开事件。 */
  public async handleDisconnected(): Promise<void> {
    if (this.reconnecting) {
      return;
    }
    this.reconnecting = true;
    this.eventBus.emit('net:disconnected');

    while (this.attempt < this.maxAttempts) {
      const delayMs = this.getDelayMs(this.attempt);
      await this.sleep(delayMs);
      this.attempt += 1;

      try {
        await this.connect();
        await this.sendReconnectReq(MsgId.RECONNECT_REQ, this.getContext());
        this.eventBus.emit('net:reconnected', { attempt: this.attempt });
        this.attempt = 0;
        this.reconnecting = false;
        return;
      } catch (error) {
        Logger.warn('Reconnect attempt failed', this.attempt, error);
        const detail = error instanceof Error ? error.message : String(error);
        if (detail.includes('session')) {
          this.eventBus.emit('net:session_expired', detail);
          this.reconnecting = false;
          return;
        }
      }
    }

    this.eventBus.emit('net:offline');
    this.reconnecting = false;
  }

  private getDelayMs(attempt: number): number {
    return Math.min(Math.pow(2, attempt) * 1000, 10000);
  }

  private async sleep(ms: number): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  }
}
