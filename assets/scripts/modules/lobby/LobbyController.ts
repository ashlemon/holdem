import { _decorator } from 'cc';
import { Logger } from '../../core/Logger';

void _decorator;

/** 大厅模块控制器。 */
export class LobbyController {
  /** 进入大厅流程。 */
  public enter(): void {
    Logger.info('Enter lobby flow');
  }
}
