import Phaser from "phaser";
import "./style.css";
import { Scenes } from "./Scenes";

const game = new Phaser.Game({
  width: innerWidth,
  height: innerHeight,
  title: "Space Shoot",
  url: import.meta.env.URL || "",
  version: import.meta.env.VERSION || "0.0.1",
  backgroundColor: "#000000",
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
  scene: Scenes,
});

const resize = () => {
  game.scale.setGameSize(window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", resize);
