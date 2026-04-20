import { _decorator } from 'cc';

void _decorator;

/** 通信包结构。 */
export interface Envelope<T = unknown> {
  msgId: number;
  seq: number;
  payload?: T;
  timestamp: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/** 编解码器：当前使用 JSON，预留 protobuf 切换点。 */
export class ProtoCodec {
  /** 编码消息。 */
  public encode(envelope: Envelope): Uint8Array {
    // TODO: 切换为 protobufjs 二进制编解码。
    return encoder.encode(JSON.stringify(envelope));
  }

  /** 解码消息。 */
  public decode(raw: ArrayBuffer): Envelope {
    // TODO: 切换为 protobufjs 二进制编解码。
    const envelope = JSON.parse(decoder.decode(new Uint8Array(raw))) as Envelope;
    return {
      msgId: envelope.msgId,
      seq: envelope.seq,
      payload: envelope.payload,
      timestamp: envelope.timestamp ?? Date.now()
    };
  }
}
