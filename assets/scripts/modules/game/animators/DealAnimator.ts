import { _decorator, Node, Prefab, Vec3, instantiate, tween } from 'cc';

void _decorator;

/** 发牌动画器。 */
export class DealAnimator {
  /** 公共牌从牌堆飞出并翻面。 */
  public async dealCommunity(root: Node, cardPrefab: Prefab, cards: string[]): Promise<void> {
    const deckPos = new Vec3(0, 0, 0);
    for (let i = 0; i < cards.length; i += 1) {
      await new Promise<void>((resolve) => {
        const cardNode = instantiate(cardPrefab);
        cardNode.setPosition(deckPos);
        root.addChild(cardNode);
        tween(cardNode)
          .to(0.25, { worldPosition: new Vec3(-200 + i * 100, 0, 0) }, { easing: 'cubicOut' })
          .call(() => resolve())
          .start();
      });
    }
  }

  /** 发底牌到玩家座位。 */
  public async dealHoleCards(fromNode: Node, toNode: Node, cardPrefab: Prefab): Promise<void> {
    await new Promise<void>((resolve) => {
      const cardNode = instantiate(cardPrefab);
      cardNode.setPosition(Vec3.clone(fromNode.worldPosition));
      fromNode.parent?.addChild(cardNode);
      tween(cardNode)
        .to(0.2, { worldPosition: Vec3.clone(toNode.worldPosition) }, { easing: 'cubicOut' })
        .call(() => resolve())
        .start();
    });
  }
}
