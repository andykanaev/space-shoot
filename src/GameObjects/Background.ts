import { GameObjects, Scene } from "phaser";
import { getRandomInt } from "../Helpers/random";

export class Background {
  private scene: Scene;
  private background: GameObjects.Group;
  private spriteWidth: number;
  private spriteHeight: number;
  private speed: number;

  constructor(
    scene: Scene,
    spriteWidth: number,
    spriteHeight: number,
    speed: number
  ) {
    this.scene = scene;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.speed = speed;
    this.background = this.scene.add.group();
    this.createBackground();

    // Добавляем слушатель события ресайза
    this.scene.scale.on("resize", this.handleResize, this);
  }

  private handleResize(): void {
    // Очищаем текущий фон
    this.background.clear(true, true);
    // Создаем новый фон
    this.createBackground();
  }

  // Добавим метод для очистки при уничтожении объекта
  public destroy(): void {
    // Удаляем слушатель события ресайза
    this.scene.scale.off("resize", this.handleResize, this);
    this.background.destroy(true);
  }

  private createBackground(): void {
    const numTilesX =
      Math.ceil(this.scene.cameras.main.width / this.spriteWidth) + 1;
    const numTilesY =
      Math.ceil(this.scene.cameras.main.height / this.spriteHeight) + 1;

    let previousSpriteNumber = 1;

    for (let y = 0; y < numTilesY + 1; y++) {
      for (let x = 0; x < numTilesX; x++) {
        let spriteNumber = getRandomInt(1, 9);

        if (spriteNumber === previousSpriteNumber) {
          spriteNumber = getRandomInt(1, 9);
        }
        previousSpriteNumber = spriteNumber;

        const sprite: GameObjects.Sprite = this.background
          .create(
            x * this.spriteWidth,
            y * this.spriteHeight,
            `space_star_${spriteNumber}`
          )
          .setOrigin(0, 0);
      }
    }
  }

  public update() {
    this.background.getChildren().forEach((tile) => {
      const sprite = tile as Phaser.GameObjects.Sprite;
      sprite.y += this.speed;

      // Если спрайт выходит за экран по вертикали
      if (sprite.y >= this.scene.cameras.main.height) {
        // Находим самый верхний спрайт
        let topY = this.scene.cameras.main.height;
        this.background.getChildren().forEach((otherTile) => {
          const otherSprite = otherTile as Phaser.GameObjects.Sprite;
          topY = Math.min(topY, otherSprite.y);
        });

        // Находим все спрайты в той же строке (с примерно одинаковым y)
        const rowSprites = this.background.getChildren().filter((rowTile) => {
          const rowSprite = rowTile as Phaser.GameObjects.Sprite;
          return Math.abs(rowSprite.y - sprite.y) < 1;
        });

        // Перемещаем всю строку спрайтов наверх
        rowSprites.forEach((rowTile) => {
          const rowSprite = rowTile as Phaser.GameObjects.Sprite;
          rowSprite.y = topY - this.spriteHeight + 1;
        });
      }
    });
  }
}
