import { _decorator, Node, instantiate, director } from 'cc';
import { UILayer } from '../../constants/UILayer';
import { ResManager } from '../res/ResManager';
import { BaseWindow } from './BaseWindow';

void _decorator;

interface OpenRecord {
  bundle: string;
  path: string;
  node: Node;
  layer: UILayer;
}

/** UI 分层与窗口栈管理。 */
export class UIManager {
  private readonly layers = new Map<UILayer, Node>();
  private readonly records = new Map<number, OpenRecord>();
  private idSeed = 1;

  public constructor(private readonly resManager: ResManager) {}

  /** 打开窗口。 */
  public async open(bundle: string, path: string, layer: UILayer, args?: unknown): Promise<number> {
    const prefab = await this.resManager.loadPrefab(bundle, path);
    const node = instantiate(prefab);
    const parent = this.getOrCreateLayer(layer);
    parent.addChild(node);

    const id = this.idSeed;
    this.idSeed += 1;

    const baseWindow = node.getComponent(BaseWindow);
    if (baseWindow) {
      baseWindow.windowId = id;
      baseWindow.onOpen(args);
    }

    this.records.set(id, { bundle, path, node, layer });
    return id;
  }

  /** 关闭窗口。 */
  public async close(id: number): Promise<void> {
    const record = this.records.get(id);
    if (!record) {
      return;
    }

    const baseWindow = record.node.getComponent(BaseWindow);
    baseWindow?.onClose();
    record.node.removeFromParent();
    record.node.destroy();
    this.records.delete(id);
    await this.resManager.release(record.bundle, record.path);
  }

  /** 关闭全部窗口。 */
  public async closeAll(): Promise<void> {
    const ids = Array.from(this.records.keys());
    for (const id of ids) {
      await this.close(id);
    }
  }

  private getOrCreateLayer(layer: UILayer): Node {
    const existed = this.layers.get(layer);
    if (existed) {
      return existed;
    }

    const scene = director.getScene();
    if (!scene) {
      throw new Error('Scene is not ready');
    }

    const node = new Node(layer);
    scene.addChild(node);
    this.layers.set(layer, node);
    return node;
  }
}
