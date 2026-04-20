import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

/** 单张牌视图。 */
@ccclass('CardView')
export class CardView extends Component {
  /** 翻牌占位方法。 */
  public flipToFace(_cardCode: string): void {
    // TODO: 接入真实牌面贴图。
  }
}
