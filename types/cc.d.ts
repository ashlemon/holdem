declare module 'cc' {
  export class Component {
    node: Node;
    protected start?(): void;
  }
  export class Node {
    name: string;
    parent: Node | null;
    worldPosition: Vec3;
    children: Node[];
    active: boolean;
    constructor(name?: string);
    addChild(node: Node): void;
    removeFromParent(): void;
    destroy(): void;
    getComponent<T>(ctor: new (...args: never[]) => T): T | null;
    addComponent<T>(ctor: new (...args: never[]) => T): T;
    setPosition(position: Vec3): void;
    setScale(x: number, y?: number, z?: number): void;
  }
  export class Prefab {}
  export class Asset {}
  export class JsonAsset extends Asset {
    json: Record<string, unknown>;
  }
  export class AudioClip extends Asset {}
  export class AudioSource extends Component {
    clip: AudioClip | null;
    play(): void;
    stop(): void;
  }
  export class Label extends Component {
    string: string;
  }
  export class Vec3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    static clone(source: Vec3): Vec3;
  }
  export interface ITweenOption {
    easing?: string;
  }
  export interface Tween<T> {
    to(duration: number, props: Record<string, unknown>, opts?: ITweenOption): Tween<T>;
    call(callback: () => void): Tween<T>;
    start(): Tween<T>;
  }
  export function tween<T>(target: T): Tween<T>;
  export function instantiate(prefab: Prefab): Node;
  export namespace _decorator {
    function ccclass(name: string): (target: new (...args: never[]) => unknown) => void;
    function property(type?: unknown): (target: object, propertyKey: string) => void;
  }
  export interface Bundle {
    load<T extends Asset>(path: string, type: new (...args: never[]) => T, onComplete: (error: Error | null, asset?: T) => void): void;
    release(path: string, type?: new (...args: never[]) => Asset): void;
  }
  export const assetManager: {
    loadBundle(name: string, onComplete: (error: Error | null, bundle?: Bundle) => void): void;
  };
  export const director: {
    loadScene(name: string, onLaunched?: (error: Error | null) => void): void;
    getScene(): Node | null;
  };
  export const resources: {
    load<T extends Asset>(path: string, type: new (...args: never[]) => T, onComplete: (error: Error | null, asset?: T) => void): void;
  };
}
