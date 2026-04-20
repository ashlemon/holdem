import { _decorator } from 'cc';
import { Logger } from '../../core/Logger';

void _decorator;

/** 登录模块控制器。 */
export class LoginController {
  /** 进入登录流程。 */
  public enter(): void {
    Logger.info('Enter login flow');
  }
}
