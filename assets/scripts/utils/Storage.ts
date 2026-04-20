import { _decorator } from 'cc';

void _decorator;

/** localStorage 轻量封装。 */
export class Storage {
  /** 读取字符串。 */
  public static getString(key: string): string | null {
    return localStorage.getItem(key);
  }

  /** 写入字符串。 */
  public static setString(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /** 删除键。 */
  public static remove(key: string): void {
    localStorage.removeItem(key);
  }
}
