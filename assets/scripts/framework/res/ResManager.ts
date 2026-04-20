import { _decorator, assetManager, Prefab } from 'cc';

void _decorator;

/** 带引用计数的资源管理。 */
export class ResManager {
  private readonly refs = new Map<string, number>();

  /** 加载 prefab 资源。 */
  public async loadPrefab(bundleName: string, path: string): Promise<Prefab> {
    const key = this.getKey(bundleName, path);
    const count = this.refs.get(key) ?? 0;
    this.refs.set(key, count + 1);

    const bundle = await this.loadBundle(bundleName);
    return new Promise<Prefab>((resolve, reject) => {
      bundle.load(path, Prefab, (error, asset) => {
        if (error || !asset) {
          reject(error ?? new Error(`Prefab not found: ${path}`));
          return;
        }
        resolve(asset);
      });
    });
  }

  /** 释放 prefab 引用。 */
  public async release(bundleName: string, path: string): Promise<void> {
    const key = this.getKey(bundleName, path);
    const count = this.refs.get(key) ?? 0;
    if (count <= 1) {
      this.refs.delete(key);
      const bundle = await this.loadBundle(bundleName);
      bundle.release(path, Prefab);
      return;
    }
    this.refs.set(key, count - 1);
  }

  private async loadBundle(bundleName: string): Promise<import('cc').Bundle> {
    return new Promise((resolve, reject) => {
      assetManager.loadBundle(bundleName, (error, bundle) => {
        if (error || !bundle) {
          reject(error ?? new Error(`Bundle not found: ${bundleName}`));
          return;
        }
        resolve(bundle);
      });
    });
  }

  private getKey(bundleName: string, path: string): string {
    return `${bundleName}:${path}`;
  }
}
