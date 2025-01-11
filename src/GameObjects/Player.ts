import { Scene } from "phaser";
import { Bullet } from "./Bullet";

export class Player {
  private scene: Scene;
  private sprite!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: {
    A: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
  };
  private moveSpeed: number = 4; // Скорость движения корабля
  private spriteScale: number = 2;
  private bullets: Bullet[] = [];
  private lastFireTime: number = 0;
  private fireDelay: number = 1; // Задержка между выстрелами в мс
  private lives: number = 3;
  private maxLives: number = 5;
  private score: number = 0;
  private lastBonusLifeScore: number = 0;
  private scoreForBonusLife: number = 150;
  private isInvulnerable: boolean = false;
  private invulnerableTime: number = 1000; // 1 секунда неуязвимости после удара

  // Текстовые объекты для отображения жизней и очков
  private livesText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createPlayer();
    this.setupControls();
    this.createUI();
    this.lastBonusLifeScore = 0;
  }

  private setupControls(): void {
    if (!this.scene.input.keyboard) {
      console.log("No keyboard input");

      return;
    }
    // Создаем курсоры для стрелок
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // Добавляем клавиши A, D и Space
    this.keys = {
      A: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      D: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      SPACE: this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      ),
    };

    // Добавляем обработчик однократного нажатия пробела
    this.keys.SPACE.on("down", () => {
      this.fire();
    });
  }

  public update(): void {
    // Движение влево
    if (this.cursors.left.isDown || this.keys.A.isDown) {
      this.moveLeft();
    }

    // Движение вправо
    if (this.cursors.right.isDown || this.keys.D.isDown) {
      this.moveRight();
    }

    // Обновление пуль
    this.bullets = this.bullets.filter((bullet) => !bullet.update());
  }

  private createPlayer(): void {
    this.sprite = this.scene.add.sprite(
      this.scene.cameras.main.width / 2,
      this.scene.cameras.main.height * 0.75,
      "player" // Убедитесь, что текстура 'player' загружена в preload
    );

    // Масштабируем спрайт если нужно
    this.sprite.setScale(this.spriteScale);
  }

  // Метод для обновления позиции при ресайзе
  public handleResize(): void {
    this.sprite.setPosition(
      this.scene.cameras.main.width / 2,
      this.scene.cameras.main.height * 0.75
    );
  }

  public destroy(): void {
    if (this.sprite) {
      this.sprite.destroy();
    }
    // Очищаем все пули
    this.bullets.forEach((bullet) => bullet.destroy());
    this.bullets = [];
    // Удаляем обработчик события пробела
    this.keys.SPACE.removeAllListeners();
    // Очищаем клавиши
    this.keys.A.destroy();
    this.keys.D.destroy();
    this.keys.SPACE.destroy();
  }

  public moveLeft(): void {
    if (this.sprite.x > 0 + (this.sprite.width * this.spriteScale) / 2) {
      this.sprite.x -= this.moveSpeed;
    }
  }

  public moveRight(): void {
    if (
      this.sprite.x <
      this.scene.cameras.main.width - (this.sprite.width * this.spriteScale) / 2
    ) {
      this.sprite.x += this.moveSpeed;
    }
  }

  public fire(): void {
    const currentTime = Date.now();
    if (currentTime - this.lastFireTime >= this.fireDelay) {
      // Создаем пулю из центра корабля
      const bullet = new Bullet(
        this.scene,
        this.sprite.x,
        this.sprite.y - this.sprite.height / 2
      );
      this.bullets.push(bullet);
      this.lastFireTime = currentTime;
    }
  }

  private createUI(): void {
    this.livesText = this.scene.add.text(10, 10, `Lives: ${this.lives}`, {
      fontSize: "24px",
      color: "#ffffff",
    });
    this.scoreText = this.scene.add.text(10, 40, `Score: ${this.score}`, {
      fontSize: "24px",
      color: "#ffffff",
    });
  }

  public takeDamage(): void {
    if (!this.isInvulnerable) {
      this.lives--;
      this.livesText.setText(`Lives: ${this.lives}`);

      if (this.lives === 2) {
        this.sprite.setTexture("player_damaged_1");
      } else if (this.lives === 1) {
        this.sprite.setTexture("player_damaged_2");
      } else if (this.lives === 0) {
        this.sprite.setTexture("player_damaged_3");
      } else if (this.lives === -1) {
        this.scene.tweens.add({
          targets: this.sprite,
          angle: 720, // Два полных оборота
          alpha: 0,
          duration: 1000,
          ease: "Power2",
        });
      }

      // Добавляем временную неуязвимость
      this.isInvulnerable = true;
      this.sprite.setAlpha(0.5);

      setTimeout(() => {
        this.isInvulnerable = false;
        this.sprite.setAlpha(1);
      }, this.invulnerableTime);
    }
  }

  public addScore(points: number): void {
    this.score += points;
    this.scoreText.setText(`Score: ${this.score}`);

    // Проверяем, нужно ли добавить бонусную жизнь
    const currentBonusLevel = Math.floor(this.score / this.scoreForBonusLife);
    const lastBonusLevel = Math.floor(
      this.lastBonusLifeScore / this.scoreForBonusLife
    );

    if (currentBonusLevel > lastBonusLevel && this.lives < this.maxLives) {
      this.addBonusLife();

      if (this.lives === 2) {
        this.sprite.setTexture("player_damaged_1");
      } else if (this.lives === 1) {
        this.sprite.setTexture("player_damaged_2");
      } else if (this.lives === 0) {
        this.sprite.setTexture("player_damaged_3");
      } else if (this.lives > 2) {
        this.sprite.setTexture("player");
      }
    }
  }

  private addBonusLife(): void {
    this.lives = Math.min(this.lives + 1, this.maxLives);
    this.lastBonusLifeScore = this.score;
    this.livesText.setText(`Lives: ${this.lives}`);

    // Добавляем анимацию для текста жизней
    this.scene.tweens.add({
      targets: this.livesText,
      scale: { from: 1.5, to: 1 },
      duration: 200,
      ease: "Bounce",
      yoyo: false,
    });

    // Создаем временный текст с уведомлением о бонусной жизни
    const bonusText = this.scene.add
      .text(this.sprite.x, this.sprite.y - 50, "+1 LIFE!", {
        fontSize: "24px",
        color: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Анимация для текста бонусной жизни
    this.scene.tweens.add({
      targets: bonusText,
      y: bonusText.y - 30,
      alpha: { from: 1, to: 0 },
      duration: 1000,
      onComplete: () => {
        bonusText.destroy();
      },
    });
  }

  public getLives(): number {
    return this.lives;
  }

  public getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite;
  }

  public getBullets(): Bullet[] {
    return this.bullets;
  }

  public reset(): void {
    this.lives = 3;
    this.score = 0;
    this.lastBonusLifeScore = 0;
    this.isDead = false;
    this.isInvulnerable = false;
    this.sprite.setAlpha(1);
    this.sprite.setAngle(0);
    this.sprite.setTexture("player");
    this.livesText.setText(`Lives: ${this.lives}`);
    this.scoreText.setText(`Score: ${this.score}`);

    // Очищаем все пули
    this.bullets.forEach((bullet) => bullet.destroy());
    this.bullets = [];
  }
}
