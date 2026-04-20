import { _decorator } from 'cc';
import { Storage } from '../utils/Storage';
import type { IPlatformAdapter, PlatformLoginResult, PlatformPayRequest, PlatformPayResult } from './IPlatformAdapter';

void _decorator;

const GUEST_KEY = 'holdem_guest_id';

/** 浏览器 H5 平台适配。 */
export class H5Adapter implements IPlatformAdapter {
  public async init(): Promise<void> {
    return Promise.resolve();
  }

  public async login(): Promise<PlatformLoginResult> {
    let guestId = Storage.getString(GUEST_KEY);
    if (!guestId) {
      guestId = `guest_${crypto.randomUUID()}`;
      Storage.setString(GUEST_KEY, guestId);
    }
    return {
      userId: guestId,
      displayName: guestId,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(guestId)}`,
      initData: guestId
    };
  }

  public async pay(_request: PlatformPayRequest): Promise<PlatformPayResult> {
    return { ok: false, message: 'H5 游客模式未接入支付。' };
  }

  public async share(content: string): Promise<void> {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(content);
    }
  }

  public getInitData(): string {
    return Storage.getString(GUEST_KEY) ?? '';
  }

  public proxyUrl(url: string): string {
    return url;
  }

  public getName(): string {
    return 'h5';
  }
}
