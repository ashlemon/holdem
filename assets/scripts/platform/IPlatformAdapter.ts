import { _decorator } from 'cc';

void _decorator;

/** 平台登录结果。 */
export interface PlatformLoginResult {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  initData?: string;
}

/** 支付请求。 */
export interface PlatformPayRequest {
  productId: string;
  amount: number;
  currency: string;
  invoiceUrl?: string;
}

/** 支付结果。 */
export interface PlatformPayResult {
  ok: boolean;
  message?: string;
}

/** 平台适配器接口。 */
export interface IPlatformAdapter {
  /** 初始化平台 SDK。 */
  init(): Promise<void>;
  /** 发起平台登录。 */
  login(): Promise<PlatformLoginResult>;
  /** 发起支付。 */
  pay(request: PlatformPayRequest): Promise<PlatformPayResult>;
  /** 分享能力。 */
  share(content: string): Promise<void>;
  /** 返回给后端验证的 initData。 */
  getInitData(): string;
  /** Discord 下代理 URL 处理。 */
  proxyUrl(url: string): string;
  /** 平台名。 */
  getName(): string;
}
