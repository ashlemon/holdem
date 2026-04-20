import { _decorator } from 'cc';

void _decorator;

const encoder = new TextEncoder();

/** Web Crypto 封装。 */
export class Crypto {
  /** 计算 SHA-256 十六进制字符串。 */
  public static async sha256Hex(value: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
    return Crypto.toHex(new Uint8Array(digest));
  }

  /** 计算 HMAC-SHA256 十六进制字符串。 */
  public static async hmacSha256Hex(secret: string, payload: string): Promise<string> {
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return Crypto.toHex(new Uint8Array(signature));
  }

  private static toHex(data: Uint8Array): string {
    return Array.from(data).map((x) => x.toString(16).padStart(2, '0')).join('');
  }
}
