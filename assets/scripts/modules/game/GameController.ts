import { _decorator } from 'cc';
import { MsgId } from '../../constants/MsgId';
import { EventBus } from '../../core/EventBus';
import { Logger } from '../../core/Logger';
import type { Envelope } from '../../network/ProtoCodec';
import type { WSClient } from '../../network/WSClient';
import { GameModel, type TableSnapshot } from './GameModel';
import { ProvablyFairVerifier } from './security/ProvablyFairVerifier';

void _decorator;

type ActionType = 'fold' | 'check' | 'call' | 'raise' | 'allin';

/** 牌桌控制器：处理推送与玩家操作。 */
export class GameController {
  public constructor(
    private readonly wsClient: WSClient,
    private readonly eventBus: EventBus,
    private readonly model: GameModel
  ) {}

  /** 初始化事件监听。 */
  public init(): void {
    this.wsClient.on(MsgId.PUSH_TABLE_STATE, (envelope) => this.onTableState(envelope));
    this.wsClient.on(MsgId.PUSH_HOLE_CARDS, (envelope) => this.onHoleCards(envelope));
    this.wsClient.on(MsgId.PUSH_DEAL, (envelope) => this.onDeal(envelope));
    this.wsClient.on(MsgId.PUSH_TURN, (envelope) => this.onTurn(envelope));
    this.wsClient.on(MsgId.PUSH_SHOWDOWN, (envelope) => void this.onShowdown(envelope));

    this.eventBus.on('action:fold', () => void this.sendAction('fold'));
    this.eventBus.on('action:check', () => void this.sendAction('check'));
    this.eventBus.on('action:call', () => void this.sendAction('call'));
    this.eventBus.on('action:raise', (amount) => void this.sendAction('raise', amount));
    this.eventBus.on('action:allin', () => void this.sendAction('allin'));
  }

  private onTableState(envelope: Envelope): void {
    this.model.applyFullSnapshot(envelope.payload as TableSnapshot);
  }

  private onHoleCards(envelope: Envelope): void {
    const payload = envelope.payload as { cards: string[] };
    this.model.setHoleCards(payload.cards ?? []);
  }

  private onDeal(envelope: Envelope): void {
    const payload = envelope.payload as { stage: string; community: string[] };
    this.model.stage = payload.stage;
    this.model.community = [...(payload.community ?? [])];
  }

  private onTurn(envelope: Envelope): void {
    const payload = envelope.payload as { seatId: number; currentBet: number; actionSeq: number };
    this.model.currentSeat = payload.seatId;
    this.model.currentBet = payload.currentBet;
    this.model.actionSeq = payload.actionSeq;
  }

  private async onShowdown(envelope: Envelope): Promise<void> {
    const payload = envelope.payload as { serverSeed: string; commitHash: string };
    const ok = await ProvablyFairVerifier.verify(payload.serverSeed, payload.commitHash);
    this.eventBus.emit('game:provably_fair', { ok });
    if (!ok) {
      Logger.error('Provably fair verification failed', payload);
    }
  }

  private async sendAction(action: ActionType, value?: unknown): Promise<void> {
    try {
      const amount = typeof value === 'number' ? value : undefined;
      await this.wsClient.request(MsgId.PLAYER_ACTION, {
        tableId: this.model.tableId,
        handId: this.model.handId,
        action,
        amount
      });
    } catch (error) {
      Logger.error('Failed to send player action', action, error);
    }
  }
}
