import { UIPanel } from "../GameObjects/UIPanel";

export class MainMenuScene extends Scene {
  private player: Player;
  private uiPanel: UIPanel;

  create(): void {
    this.player = new Player(this);
    this.uiPanel = new UIPanel(this);

    // Подключаем управление через UI
    this.uiPanel.onLeftPress = () => this.player.moveLeft();
    this.uiPanel.onRightPress = () => this.player.moveRight();
    this.uiPanel.onFirePress = () => this.player.fire();

    this.scale.on("resize", this.handleResize, this);
  }

  private handleResize(): void {
    if (this.player) {
      this.player.handleResize();
    }
    if (this.uiPanel) {
      this.uiPanel.handleResize();
    }
  }

  destroy(): void {
    if (this.player) {
      this.player.destroy();
    }
    if (this.uiPanel) {
      this.uiPanel.destroy();
    }
    this.scale.off("resize", this.handleResize, this);
  }
}
