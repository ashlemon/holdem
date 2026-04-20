import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

/** UI 窗口基类。 */
@ccclass('BaseWindow')
export class BaseWindow extends Component {
  public windowId = 0;

  /** 窗口打开回调。 */
  public onOpen(_args?: unknown): void {
    // 子类按需覆写。
  }

  /** 窗口关闭回调。 */
  public onClose(): void {
    // 子类按需覆写。
  }
}
