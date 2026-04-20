import { _decorator } from 'cc';

void _decorator;

/** 玩家状态。 */
export interface PlayerState {
  seatId: number;
  userId: string;
  chips: number;
  bet: number;
  folded: boolean;
}

/** 牌局快照。 */
export interface TableSnapshot {
  tableId: string;
  handId: string;
  stage: string;
  players: PlayerState[];
  community: string[];
  pot: number;
  currentSeat: number;
  currentBet: number;
  mySeat: number;
  actionSeq: number;
  handSeedHash: string;
}

/** 客户端牌局状态模型。 */
export class GameModel {
  public tableId = '';
  public handId = '';
  public stage = '';
  public players = new Map<number, PlayerState>();
  public community: string[] = [];
  public pot = 0;
  public currentSeat = -1;
  public currentBet = 0;
  public myHoleCards: string[] = [];
  public mySeat = -1;
  public actionSeq = 0;
  public handSeedHash = '';

  /** 应用完整快照。 */
  public applyFullSnapshot(snapshot: TableSnapshot): void {
    this.tableId = snapshot.tableId;
    this.handId = snapshot.handId;
    this.stage = snapshot.stage;
    this.players = new Map(snapshot.players.map((player) => [player.seatId, player]));
    this.community = [...snapshot.community];
    this.pot = snapshot.pot;
    this.currentSeat = snapshot.currentSeat;
    this.currentBet = snapshot.currentBet;
    this.mySeat = snapshot.mySeat;
    this.actionSeq = snapshot.actionSeq;
    this.handSeedHash = snapshot.handSeedHash;
  }

  /** 设置我的底牌。 */
  public setHoleCards(cards: string[]): void {
    this.myHoleCards = [...cards];
  }

  /** 当前是否轮到我行动。 */
  public isMyTurn(): boolean {
    return this.currentSeat >= 0 && this.currentSeat === this.mySeat;
  }

  /** 获取我的玩家数据。 */
  public getMyPlayer(): PlayerState | undefined {
    return this.players.get(this.mySeat);
  }

  /** 重置牌局数据。 */
  public reset(): void {
    this.tableId = '';
    this.handId = '';
    this.stage = '';
    this.players.clear();
    this.community = [];
    this.pot = 0;
    this.currentSeat = -1;
    this.currentBet = 0;
    this.myHoleCards = [];
    this.mySeat = -1;
    this.actionSeq = 0;
    this.handSeedHash = '';
  }
}
