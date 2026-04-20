import { _decorator } from 'cc';
import { Crypto } from '../utils/Crypto';

void _decorator;

/** 请求签名器。 */
export class Signer {
  /** 对 payload 做 HMAC-SHA256 签名。 */
  public static async sign(payload: string, secret: string): Promise<string> {
    return Crypto.hmacSha256Hex(secret, payload);
  }
}
