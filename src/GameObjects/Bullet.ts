import { Scene } from "phaser";

export class Bullet {
  private scene: Scene;
  public sprite: Phaser.GameObjects.Rectangle;
  private speed: number = 5;

  constructor(scene: Scene, x: number, y: number) {
    this.scene = scene;
    console.log(this.scene);

    this.sprite = scene.add.rectangle(x, y, 4, 12, 0xffff00);
  }

  public update(): boolean {
    this.sprite.y -= this.speed;

    // Возвращаем true если пуля вышла за пределы экрана
    if (this.sprite.y < -this.sprite.height) {
      this.destroy();
      return true;
    }
    return false;
  }

  public destroy(): void {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }

  public getBounds(): Phaser.Geom.Rectangle {
    return this.sprite.getBounds();
  }
}
