import { _decorator } from 'cc';
import type { IPlatformAdapter, PlatformLoginResult, PlatformPayRequest, PlatformPayResult } from './IPlatformAdapter';

void _decorator;

/** 微信小游戏平台适配。 */
export class WechatAdapter implements IPlatformAdapter {
  private initData = '';

  public async init(): Promise<void> {
    return Promise.resolve();
  }

  public async login(): Promise<PlatformLoginResult> {
    const code = await new Promise<string>((resolve, reject) => {
      wx.login({
        success: (result) => resolve(result.code),
        fail: () => reject(new Error('wx.login failed'))
      });
    });
    this.initData = code;
    return {
      userId: `wx_${code}`,
      displayName: 'wechat_user',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(code)}`,
      initData: code
    };
  }

  public async pay(_request: PlatformPayRequest): Promise<PlatformPayResult> {
    return { ok: false, message: '微信小游戏版本暂不支持内置支付。' };
  }

  public async share(_content: string): Promise<void> {
    return Promise.resolve();
  }

  public getInitData(): string {
    return this.initData;
  }

  public proxyUrl(url: string): string {
    return url;
  }

  public getName(): string {
    return 'wechat';
  }
}
