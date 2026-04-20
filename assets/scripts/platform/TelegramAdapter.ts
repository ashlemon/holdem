import { _decorator } from 'cc';
import { Logger } from '../core/Logger';
import type { IPlatformAdapter, PlatformLoginResult, PlatformPayRequest, PlatformPayResult } from './IPlatformAdapter';

void _decorator;

/** Telegram Mini App 平台适配。 */
export class TelegramAdapter implements IPlatformAdapter {
  private initData = '';

  public async init(): Promise<void> {
    const webApp = window.Telegram?.WebApp;
    this.initData = webApp?.initData ?? '';
    webApp?.ready?.();
  }

  public async login(): Promise<PlatformLoginResult> {
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const userId = String(user?.id ?? 'tg_unknown');
    return {
      userId,
      displayName: user?.username ?? user?.first_name ?? 'telegram_user',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userId)}`,
      initData: this.initData
    };
  }

  public async pay(request: PlatformPayRequest): Promise<PlatformPayResult> {
    if (!request.invoiceUrl) {
      return { ok: false, message: '缺少 Telegram invoiceUrl。' };
    }

    return new Promise<PlatformPayResult>((resolve) => {
      window.Telegram?.WebApp?.openInvoice?.(request.invoiceUrl as string, (status) => {
        resolve({ ok: status === 'paid', message: `Telegram Stars 状态: ${status}` });
      });
    });
  }

  public async share(content: string): Promise<void> {
    Logger.info('Telegram share placeholder', content);
  }

  public getInitData(): string {
    return this.initData;
  }

  public proxyUrl(url: string): string {
    return url;
  }

  public getName(): string {
    return 'telegram';
  }
}
