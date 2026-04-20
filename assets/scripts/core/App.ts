import { _decorator, Component, Label, resources, JsonAsset, director } from 'cc';
import { MsgId } from '../constants/MsgId';
import { ErrorHandler } from './ErrorHandler';
import { EventBus } from './EventBus';
import { Logger } from './Logger';
import { Heartbeat } from '../network/Heartbeat';
import { ProtoCodec } from '../network/ProtoCodec';
import { Reconnector, type ReconnectContext } from '../network/Reconnector';
import { WSClient } from '../network/WSClient';
import { PlatformFactory } from '../platform/PlatformFactory';

const { ccclass, property } = _decorator;

interface AppConfig {
  wsUrl: string;
}

/** 应用启动入口。 */
@ccclass('App')
export class App extends Component {
  @property(Label)
  public errorLabel: Label | null = null;

  private readonly eventBus = new EventBus();
  private readonly codec = new ProtoCodec();
  private readonly wsClient = new WSClient(this.codec, this.eventBus);
  private readonly heartbeat = new Heartbeat(this.wsClient, 5000, 15000);
  private reconnectSessionToken = '';
  private reconnectTableId = '';

  protected start(): void {
    void this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    try {
      const config = await this.loadConfig();
      const platform = PlatformFactory.create();

      await platform.init();
      const loginInfo = await platform.login();

      await this.wsClient.connect(platform.proxyUrl(config.wsUrl));
      this.installReconnect(config.wsUrl);
      this.eventBus.on('net:message', () => this.heartbeat.markReceived());
      this.heartbeat.start();

      const loginResponse = await this.wsClient.request(MsgId.LOGIN_REQ, {
        platform: platform.getName(),
        initData: loginInfo.initData ?? platform.getInitData(),
        userId: loginInfo.userId,
        displayName: loginInfo.displayName
      });

      const payload = (loginResponse.payload ?? {}) as { sessionToken?: string; tableId?: string };
      this.reconnectSessionToken = payload.sessionToken ?? '';
      this.reconnectTableId = payload.tableId ?? '';

      director.loadScene('Lobby', (error) => {
        if (error) {
          this.showError(ErrorHandler.handle(error, '进入 Lobby 失败'));
        }
      });
    } catch (error) {
      this.showError(ErrorHandler.handle(error, '启动流程失败'));
    }
  }

  private installReconnect(wsUrl: string): void {
    const reconnector = new Reconnector(
      this.eventBus,
      () => this.wsClient.connect(wsUrl),
      async (msgId, payload) => {
        await this.wsClient.request(msgId, payload);
      },
      (): ReconnectContext => ({
        session_token: this.reconnectSessionToken,
        last_seq: this.wsClient.getLastSeq(),
        table_id: this.reconnectTableId
      })
    );
    this.wsClient.setReconnector(reconnector);

    this.eventBus.on('net:offline', () => {
      Logger.error('Network offline after retries.');
      this.showError('网络连接失败，请检查网络后重试');
    });
    this.eventBus.on('net:session_expired', () => {
      this.showError('会话已过期，请重新登录');
    });
  }

  private async loadConfig(): Promise<AppConfig> {
    return new Promise<AppConfig>((resolve, reject) => {
      resources.load('config/default', JsonAsset, (error, asset) => {
        if (error || !asset) {
          reject(error ?? new Error('Load config/default failed'));
          return;
        }
        const json = asset.json as unknown as AppConfig;
        if (!json.wsUrl) {
          reject(new Error('wsUrl is missing in config/default.json'));
          return;
        }
        resolve({ wsUrl: json.wsUrl });
      });
    });
  }

  private showError(message: string): void {
    if (this.errorLabel) {
      this.errorLabel.string = message;
      return;
    }
    Logger.error(message);
  }
}
