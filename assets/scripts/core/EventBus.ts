import { _decorator } from 'cc';

void _decorator;

type Listener = (payload?: unknown) => void;

/** 轻量事件总线。 */
export class EventBus {
  private readonly listeners = new Map<string, Set<Listener>>();

  /** 监听事件。 */
  public on(event: string, listener: Listener): () => void {
    const group = this.listeners.get(event) ?? new Set<Listener>();
    group.add(listener);
    this.listeners.set(event, group);
    return () => this.off(event, listener);
  }

  /** 取消监听事件。 */
  public off(event: string, listener: Listener): void {
    const group = this.listeners.get(event);
    if (!group) {
      return;
    }
    group.delete(listener);
    if (group.size === 0) {
      this.listeners.delete(event);
    }
  }

  /** 分发事件。 */
  public emit(event: string, payload?: unknown): void {
    const group = this.listeners.get(event);
    if (!group) {
      return;
    }
    for (const listener of group) {
      listener(payload);
    }
  }
}
