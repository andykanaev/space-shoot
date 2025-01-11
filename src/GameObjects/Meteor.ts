import { Scene } from "phaser";
import { Player } from "./Player";

export class Meteor {
  private scene: Scene;
  public sprite!: Phaser.GameObjects.Rectangle;
  private speed: number = 3;
  private uiPanelHeight: number;
  private player: Player;

  constructor(scene: Scene, player: Player) {
    this.scene = scene;
    this.player = player;
    this.uiPanelHeight = this.scene.cameras.main.height * 0.2;
    this.createMeteor();
  }

  private createMeteor(): void {
    // Получаем ширину спрайта игрока
    const playerWidth = this.player.getSprite().width;

    // Случайная позиция по X:
    // Слева: начиная с половины ширины игрока
    // Справа: заканчивая на ширине сцены минус половина ширины игрока
    const minX = playerWidth / 2;
    const maxX = this.scene.cameras.main.width - playerWidth / 2;
    const x = Phaser.Math.Between(minX, maxX);

    // Создаем метеорит за пределами экрана сверху
    this.sprite = this.scene.add.rectangle(x, -20, 30, 30, 0x8b4513);
  }

  public update(): boolean {
    this.sprite.y += this.speed;

    // Возвращаем true если метеорит достиг UI панели
    const maxY = this.scene.cameras.main.height - this.uiPanelHeight;
    if (this.sprite.y > maxY) {
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
}
