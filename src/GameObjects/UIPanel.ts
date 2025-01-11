import { Scene } from "phaser";

export class UIPanel {
  private scene!: Scene;
  private panel!: Phaser.GameObjects.Rectangle;
  private leftButton!: Phaser.GameObjects.Rectangle;
  private rightButton!: Phaser.GameObjects.Rectangle;
  private fireButton!: Phaser.GameObjects.Rectangle;

  // Флаги для отслеживания нажатых кнопок
  private isLeftPressed: boolean = false;
  private isRightPressed: boolean = false;

  public onLeftPress?: () => void;
  public onRightPress?: () => void;
  public onFirePress?: () => void;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createPanel();
    this.createButtons();
  }

  private createPanel(): void {
    const height = this.scene.cameras.main.height * 0.2;
    this.panel = this.scene.add
      .rectangle(
        0,
        this.scene.cameras.main.height - height,
        this.scene.cameras.main.width,
        height,
        0x808080
      )
      .setOrigin(0, 0);
  }

  private createButtons(): void {
    const panelHeight = this.panel.height;
    const panelY = this.panel.y;
    const buttonSize = 40;

    // Левая кнопка
    this.leftButton = this.scene.add
      .rectangle(40, panelY + panelHeight / 2, buttonSize, buttonSize, 0x666666)
      .setInteractive();

    // Правая кнопка
    this.rightButton = this.scene.add
      .rectangle(
        40 + buttonSize + 10,
        panelY + panelHeight / 2,
        buttonSize,
        buttonSize,
        0x666666
      )
      .setInteractive();

    // Кнопка огня (справа)
    this.fireButton = this.scene.add
      .rectangle(
        this.scene.cameras.main.width - buttonSize,
        panelY + panelHeight / 2,
        buttonSize,
        buttonSize,
        0xff0000
      )
      .setInteractive();

    // Добавляем текст на кнопки
    this.scene.add
      .text(this.leftButton.x, this.leftButton.y, "←", {
        fontSize: "32px",
      })
      .setOrigin(0.5);

    this.scene.add
      .text(this.rightButton.x, this.rightButton.y, "→", {
        fontSize: "32px",
      })
      .setOrigin(0.5);

    this.scene.add
      .text(this.fireButton.x, this.fireButton.y, "🔥", {
        fontSize: "24px",
      })
      .setOrigin(0.5);

    this.setupButtonEvents();
  }

  private setupButtonEvents(): void {
    // Левая кнопка
    this.leftButton
      .on("pointerdown", () => {
        this.leftButton.setFillStyle(0x444444);
        this.isLeftPressed = true;
      })
      .on("pointerup", () => {
        this.leftButton.setFillStyle(0x666666);
        this.isLeftPressed = false;
      })
      .on("pointerout", () => {
        this.leftButton.setFillStyle(0x666666);
        this.isLeftPressed = false;
      });

    // Правая кнопка
    this.rightButton
      .on("pointerdown", () => {
        this.rightButton.setFillStyle(0x444444);
        this.isRightPressed = true;
      })
      .on("pointerup", () => {
        this.rightButton.setFillStyle(0x666666);
        this.isRightPressed = false;
      })
      .on("pointerout", () => {
        this.rightButton.setFillStyle(0x666666);
        this.isRightPressed = false;
      });

    this.fireButton
      .on("pointerdown", () => {
        this.fireButton.setFillStyle(0xcc0000);
        if (this.onFirePress) this.onFirePress();
      })
      .on("pointerup", () => {
        this.fireButton.setFillStyle(0xff0000);
      })
      .on("pointerout", () => {
        this.fireButton.setFillStyle(0xff0000);
      });
  }

  public handleResize(): void {
    const height = this.scene.cameras.main.height * 0.2;
    this.panel.setPosition(0, this.scene.cameras.main.height - height);
    this.panel.setSize(this.scene.cameras.main.width, height);

    const buttonSize = height * 0.6;
    const padding = buttonSize * 0.5;

    this.leftButton.setPosition(padding, this.panel.y + height / 2);
    this.rightButton.setPosition(
      padding * 2 + buttonSize,
      this.panel.y + height / 2
    );
    this.fireButton.setPosition(
      this.scene.cameras.main.width - padding - buttonSize,
      this.panel.y + height / 2
    );
  }

  public destroy(): void {
    this.panel.destroy();
    this.leftButton.destroy();
    this.rightButton.destroy();
    this.fireButton.destroy();
  }

  // Добавляем метод update для проверки зажатых кнопок
  public update(): void {
    if (this.isLeftPressed && this.onLeftPress) {
      this.onLeftPress();
    }
    if (this.isRightPressed && this.onRightPress) {
      this.onRightPress();
    }
  }
}
