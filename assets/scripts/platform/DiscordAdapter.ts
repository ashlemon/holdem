import { _decorator } from 'cc';
import type { IPlatformAdapter, PlatformLoginResult, PlatformPayRequest, PlatformPayResult } from './IPlatformAdapter';

void _decorator;

type DiscordSdkInstance = {
  ready?: () => Promise<void>;
};

/** Discord Activity 平台适配。 */
export class DiscordAdapter implements IPlatformAdapter {
  private sdk: DiscordSdkInstance | null = null;

  public async init(): Promise<void> {
    const module = (await import('@discord/embedded-app-sdk')) as Record<string, unknown>;
    const SDKCtor = module.DiscordSDK as (new (clientId: string) => DiscordSdkInstance) | undefined;
    if (!SDKCtor) {
      throw new Error('DiscordSDK unavailable');
    }
    this.sdk = new SDKCtor(window.DISCORD_CLIENT_ID ?? 'DISCORD_CLIENT_ID');
    await this.sdk.ready?.();
  }

  public async login(): Promise<PlatformLoginResult> {
    // TODO: 使用 Discord OAuth2 获取用户信息。
    return {
      userId: 'discord_guest',
      displayName: 'discord_guest',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=discord_guest',
      initData: 'discord-oauth-placeholder'
    };
  }

  public async pay(_request: PlatformPayRequest): Promise<PlatformPayResult> {
    return { ok: false, message: 'Discord 支付请按地区接入 IAP。' };
  }

  public async share(_content: string): Promise<void> {
    return Promise.resolve();
  }

  public getInitData(): string {
    return 'discord-oauth-placeholder';
  }

  public proxyUrl(url: string): string {
    if (url.startsWith('/.proxy/')) {
      return url;
    }
    const normalized = url.startsWith('/') ? url.slice(1) : url;
    return `/.proxy/${normalized}`;
  }

  public getName(): string {
    return 'discord';
  }
}
