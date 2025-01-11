import { Scene } from "phaser";
import { Meteor } from "./Meteor";
import { Player } from "./Player";

export class MeteorManager {
  private scene: Scene;
  private meteors: Meteor[] = [];
  private player: Player;
  private spawnTimer: number = 0;
  private isActive: boolean = true;

  private minSpawnInterval: number = 0.4 * 1000;
  private maxSpawnInterval: number = 1.5 * 1000;

  constructor(scene: Scene, player: Player) {
    this.scene = scene;
    this.player = player;
    // Устанавливаем первый интервал при создании
    this.setNewSpawnInterval();
  }

  private setNewSpawnInterval(): number {
    // Получаем случайное время между minSpawnInterval и maxSpawnInterval
    return Phaser.Math.Between(this.minSpawnInterval, this.maxSpawnInterval);
  }

  public stopSpawning(): void {
    this.isActive = false;
  }

  public update(time: number): void {
    if (!this.isActive) return;

    // Создание новых метеоритов
    if (time > this.spawnTimer) {
      this.spawnMeteor();
      this.spawnTimer = time + this.setNewSpawnInterval();
    }

    // Обновление существующих метеоритов
    this.meteors = this.meteors.filter((meteor) => !meteor.update());

    // Проверка столкновений
    this.checkCollisions();
  }

  private spawnMeteor(): void {
    console.log("Spawn meteor");
    this.meteors.push(new Meteor(this.scene, this.player));
  }

  private checkCollisions(): void {
    const playerSprite = this.player.getSprite();
    const bullets = this.player.getBullets();

    this.meteors.forEach((meteor) => {
      // Проверка столкновения с игроком
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          meteor.sprite.getBounds(),
          playerSprite.getBounds()
        )
      ) {
        this.player.takeDamage();
        meteor.destroy();
        this.meteors = this.meteors.filter((m) => m !== meteor);
      }

      // Проверка столкновения с пулями
      bullets.forEach((bullet) => {
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            meteor.sprite.getBounds(),
            bullet.sprite.getBounds()
          )
        ) {
          this.player.addScore(10);
          meteor.destroy();
          bullet.destroy();
          this.meteors = this.meteors.filter((m) => m !== meteor);
        }
      });
    });
  }

  public destroy(): void {
    this.meteors.forEach((meteor) => meteor.destroy());
    this.meteors = [];
  }
}
