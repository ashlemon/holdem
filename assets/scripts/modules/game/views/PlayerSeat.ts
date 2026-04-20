import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

/** 玩家座位视图。 */
@ccclass('PlayerSeat')
export class PlayerSeat extends Component {
  @property()
  public seatId = -1;
}
