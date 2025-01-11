import { Scene } from "phaser";
import { Background } from "../GameObjects/Background";
import { Player } from "../GameObjects/Player";
import { UIPanel } from "../GameObjects/UIPanel";
import { MeteorManager } from "../GameObjects/MeteorManager";

export class MainMenuScene extends Scene {
  private background!: Background;
  private player!: Player;
  private uiPanel!: UIPanel;
  private meteorManager!: MeteorManager;
  private gameOverText!: Phaser.GameObjects.Text;
  private restartButton!: Phaser.GameObjects.Container;
  private isGameOver: boolean = false;

  constructor() {
    super("MainMenuScene");
  }

  preload(): void {
    this.load.image("space_star_1", "/assets/backgrounds/space_star_1.png");
    this.load.image("space_star_2", "/assets/backgrounds/space_star_2.png");
    this.load.image("space_star_3", "/assets/backgrounds/space_star_3.png");
    this.load.image("space_star_4", "/assets/backgrounds/space_star_4.png");
    this.load.image("space_star_5", "/assets/backgrounds/space_star_5.png");
    this.load.image("space_star_6", "/assets/backgrounds/space_star_6.png");
    this.load.image("space_star_7", "/assets/backgrounds/space_star_7.png");
    this.load.image("space_star_8", "/assets/backgrounds/space_star_8.png");
    this.load.image("space_star_9", "/assets/backgrounds/space_star_9.png");
    this.load.image("player", "/assets/player/palyer_default.png");
    this.load.image("player_damaged_1", "/assets/player/player_damaged_1.png");
    this.load.image("player_damaged_2", "/assets/player/player_damaged_2.png");
    this.load.image("player_damaged_3", "/assets/player/player_damaged_3.png");
  }

  create(): void {
    this.createGame();
  }

  private createGame(): void {
    // Очищаем предыдущие объекты если они есть
    if (this.player) this.player.destroy();
    if (this.uiPanel) this.uiPanel.destroy();
    if (this.meteorManager) this.meteorManager.destroy();

    this.isGameOver = false;

    this.background = new Background(this, 64, 64, 0.9);
    this.player = new Player(this);
    this.meteorManager = new MeteorManager(this, this.player);

    this.uiPanel = new UIPanel(this);

    // Создаем текст GameOver и кнопку рестарта (изначально невидимые)
    this.createGameOverElements();

    // Подключаем управление через UI
    this.uiPanel.onLeftPress = () => this.player.moveLeft();
    this.uiPanel.onRightPress = () => this.player.moveRight();
    this.uiPanel.onFirePress = () => this.player.fire();

    this.scale.on("resize", this.handleResize, this);
  }

  private createGameOverElements(): void {
    // GameOver текст
    this.gameOverText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 50,
        "GAME OVER",
        {
          fontSize: "64px",
          color: "#ff0000",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5)
      .setVisible(false);

    // Создаем контейнер для кнопки
    this.restartButton = this.add.container(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 50
    );

    // Фон кнопки
    const buttonBackground = this.add.rectangle(0, 0, 200, 50, 0x4a4a4a);

    // Текст кнопки
    const buttonText = this.add
      .text(0, 0, "Начать заново", {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Добавляем элементы в контейнер
    this.restartButton.add([buttonBackground, buttonText]);

    // Делаем кнопку интерактивной
    buttonBackground
      .setInteractive()
      .on("pointerover", () => buttonBackground.setFillStyle(0x666666))
      .on("pointerout", () => buttonBackground.setFillStyle(0x4a4a4a))
      .on("pointerdown", () => this.restartGame());

    this.restartButton.setVisible(false);
  }

  private restartGame(): void {
    this.gameOverText.setVisible(false);
    this.restartButton.setVisible(false);
    this.createGame();
  }

  update(time: number, delta: number): void {
    if (this.isGameOver) return;

    this.background.update();
    if (this.player) {
      this.player.update();
    }
    if (this.uiPanel) {
      this.uiPanel.update();
    }
    if (this.meteorManager) {
      this.meteorManager.update(time);
    }

    // Проверка окончания игры
    if (this.player.getLives() < 0 && !this.isGameOver) {
      this.gameOver();
    }
  }

  private gameOver(): void {
    this.isGameOver = true;
    this.meteorManager.stopSpawning();
    this.gameOverText.setVisible(true);
    this.restartButton.setVisible(true);
  }

  private handleResize(): void {
    if (this.player) {
      this.player.handleResize();
    }
    if (this.uiPanel) {
      this.uiPanel.handleResize();
    }
    // Обновляем позицию текста GameOver и кнопки при ресайзе
    if (this.gameOverText) {
      this.gameOverText.setPosition(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 50
      );
    }
    if (this.restartButton) {
      this.restartButton.setPosition(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 50
      );
    }
  }

  destroy(): void {
    if (this.player) {
      this.player.destroy();
    }
    if (this.uiPanel) {
      this.uiPanel.destroy();
    }
    if (this.meteorManager) {
      this.meteorManager.destroy();
    }
    if (this.gameOverText) {
      this.gameOverText.destroy();
    }
    if (this.restartButton) {
      this.restartButton.destroy();
    }
    this.scale.off("resize", this.handleResize, this);
  }
}
