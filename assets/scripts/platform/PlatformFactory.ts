import { _decorator } from 'cc';
import type { IPlatformAdapter } from './IPlatformAdapter';
import { TelegramAdapter } from './TelegramAdapter';
import { DiscordAdapter } from './DiscordAdapter';
import { WechatAdapter } from './WechatAdapter';
import { H5Adapter } from './H5Adapter';

void _decorator;

/** 平台适配器工厂。 */
export class PlatformFactory {
  /** 根据运行环境创建平台适配器。 */
  public static create(): IPlatformAdapter {
    const hinted = window.__HOLD_EM_PLATFORM__?.toLowerCase();
    if (hinted === 'telegram') {
      return new TelegramAdapter();
    }
    if (hinted === 'discord') {
      return new DiscordAdapter();
    }
    if (hinted === 'wechat') {
      return new WechatAdapter();
    }

    if (window.Telegram?.WebApp) {
      return new TelegramAdapter();
    }

    if (typeof wx !== 'undefined') {
      return new WechatAdapter();
    }

    return new H5Adapter();
  }
}
