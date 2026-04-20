import { _decorator } from 'cc';
import { EventBus } from '../core/EventBus';
import { Logger } from '../core/Logger';
import { MsgId } from '../constants/MsgId';
import { ProtoCodec, type Envelope } from './ProtoCodec';
import type { Reconnector } from './Reconnector';

void _decorator;

type PushHandler = (envelope: Envelope) => void;

interface PendingRequest {
  resolve: (value: Envelope) => void;
  reject: (reason?: unknown) => void;
  timer: number;
}

/** WebSocket 客户端。 */
export class WSClient {
  private ws: WebSocket | null = null;
  private seq = 1;
  private readonly pending = new Map<number, PendingRequest>();
  private readonly handlers = new Map<number, Set<PushHandler>>();
  private reconnector: Reconnector | null = null;
  private currentUrl = '';

  public constructor(private readonly codec: ProtoCodec, private readonly eventBus: EventBus) {}

  /** 设置重连器。 */
  public setReconnector(reconnector: Reconnector): void {
    this.reconnector = reconnector;
  }

  /** 连接服务器。 */
  public async connect(url: string): Promise<void> {
    this.currentUrl = url;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.binaryType = 'arraybuffer';
      ws.onopen = () => {
        this.ws = ws;
        Logger.info('WebSocket connected', url);
        resolve();
      };
      ws.onerror = () => reject(new Error('WebSocket connect error'));
      ws.onclose = () => {
        this.cleanupPending('socket closed');
        if (this.reconnector) {
          void this.reconnector.handleDisconnected();
        }
      };
      ws.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          this.handleIncoming(event.data);
        }
      };
    });
  }

  /** 发送请求并等待响应。 */
  public async request<TReq extends object, TRsp = unknown>(
    msgId: MsgId,
    payload: TReq,
    timeoutMs = 8000
  ): Promise<Envelope<TRsp>> {
    const seq = this.nextSeq();
    this.sendEnvelope({ msgId, seq, payload, timestamp: Date.now() });

    return new Promise<Envelope<TRsp>>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        this.pending.delete(seq);
        reject(new Error(`Request timeout: ${msgId}`));
      }, timeoutMs);

      this.pending.set(seq, {
        resolve: (value) => resolve(value as Envelope<TRsp>),
        reject,
        timer
      });
    });
  }

  /** 发送单向消息。 */
  public send<TReq extends object>(msgId: MsgId, payload: TReq): void {
    this.sendEnvelope({ msgId, seq: this.nextSeq(), payload, timestamp: Date.now() });
  }

  /** 注册推送监听。 */
  public on(msgId: MsgId, handler: PushHandler): () => void {
    const group = this.handlers.get(msgId) ?? new Set<PushHandler>();
    group.add(handler);
    this.handlers.set(msgId, group);
    return () => {
      const current = this.handlers.get(msgId);
      if (!current) {
        return;
      }
      current.delete(handler);
      if (current.size === 0) {
        this.handlers.delete(msgId);
      }
    };
  }

  /** 主动关闭连接。 */
  public close(): void {
    this.ws?.close();
  }

  /** 心跳超时时强制关闭连接。 */
  public forceClose(): void {
    this.ws?.close();
  }

  /** 获取最新 seq。 */
  public getLastSeq(): number {
    return this.seq - 1;
  }

  /** 获取当前连接地址。 */
  public getCurrentUrl(): string {
    return this.currentUrl;
  }

  private nextSeq(): number {
    const value = this.seq;
    this.seq += 1;
    return value;
  }

  private sendEnvelope<TPayload>(envelope: Envelope<TPayload>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      Logger.warn('WebSocket is not open, skip send', envelope.msgId);
      return;
    }
    this.ws.send(this.codec.encode(envelope));
  }

  private handleIncoming(raw: ArrayBuffer): void {
    try {
      const envelope = this.codec.decode(raw);
      this.eventBus.emit('net:message', envelope);

      const pending = this.pending.get(envelope.seq);
      if (pending) {
        clearTimeout(pending.timer);
        this.pending.delete(envelope.seq);
        pending.resolve(envelope);
        return;
      }

      const group = this.handlers.get(envelope.msgId);
      if (!group) {
        return;
      }
      for (const handler of group) {
        handler(envelope);
      }
    } catch (error) {
      Logger.error('Failed to decode incoming message', error);
    }
  }

  private cleanupPending(reason: string): void {
    for (const [seq, pending] of this.pending.entries()) {
      clearTimeout(pending.timer);
      pending.reject(new Error(`${reason}, seq=${seq}`));
    }
    this.pending.clear();
  }
}
