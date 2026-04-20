import { _decorator, AudioSource, AudioClip, Node } from 'cc';

void _decorator;

/** 简单音频管理器。 */
export class AudioManager {
  private source: AudioSource;

  public constructor(hostNode: Node) {
    this.source = hostNode.getComponent(AudioSource) ?? hostNode.addComponent(AudioSource);
  }

  /** 播放音效。 */
  public playSfx(clip: AudioClip): void {
    this.source.clip = clip;
    this.source.play();
  }

  /** 停止音效。 */
  public stop(): void {
    this.source.stop();
  }
}
