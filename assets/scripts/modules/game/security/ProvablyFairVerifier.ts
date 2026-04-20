import { _decorator } from 'cc';
import { Crypto } from '../../../utils/Crypto';

void _decorator;

/** Provably Fair 校验器。 */
export class ProvablyFairVerifier {
  /** 校验 SHA256(serverSeed) 是否等于 commitHash。 */
  public static async verify(serverSeed: string, commitHash: string): Promise<boolean> {
    const hashed = await Crypto.sha256Hex(serverSeed);
    return hashed.toLowerCase() === commitHash.toLowerCase();
  }
}
