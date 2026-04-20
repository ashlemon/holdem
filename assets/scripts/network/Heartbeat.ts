import { _decorator } from 'cc';
import { MsgId } from '../constants/MsgId';
import { Logger } from '../core/Logger';
import type { WSClient } from './WSClient';

void _decorator;

/** 连接心跳管理。 */
export class Heartbeat {
  private timer: number | null = null;
  private lastMessageAt = Date.now();

  public constructor(
    private readonly wsClient: WSClient,
    private readonly intervalMs = 5000,
    private readonly timeoutMs = 15000
  ) {}

  /** 启动心跳。 */
  public start(): void {
    this.stop();
    this.lastMessageAt = Date.now();
    this.timer = window.setInterval(() => {
      const idleMs = Date.now() - this.lastMessageAt;
      if (idleMs >= this.timeoutMs) {
        Logger.warn('Heartbeat timeout reached, closing websocket.');
        this.wsClient.forceClose();
        this.stop();
        return;
      }
      this.wsClient.send(MsgId.HEARTBEAT_REQ, { ts: Date.now() });
    }, this.intervalMs);
  }

  /** 停止心跳。 */
  public stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /** 记录收到任意消息的时间。 */
  public markReceived(): void {
    this.lastMessageAt = Date.now();
  }
}
