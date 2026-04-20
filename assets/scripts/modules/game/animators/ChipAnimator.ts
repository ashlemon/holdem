import { _decorator, Node, tween, Vec3 } from 'cc';

void _decorator;

/** 筹码飞行动画器。 */
export class ChipAnimator {
  /** 让筹码从起点飞到终点。 */
  public async fly(chipNode: Node, target: Node): Promise<void> {
    await new Promise<void>((resolve) => {
      tween(chipNode)
        .to(0.2, { worldPosition: Vec3.clone(target.worldPosition) }, { easing: 'cubicOut' })
        .call(() => resolve())
        .start();
    });
  }
}
