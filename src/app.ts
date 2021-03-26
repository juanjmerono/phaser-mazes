import "phaser";
import { WelcomeScene } from "./welcomeScene";
import { GameScene } from "./gameScene";
import { ScoreScene } from "./scoreScene";


const config = {
  title: "InfiniteMaze",
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'infinitemaze',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  scene: [/*WelcomeScene, */GameScene, ScoreScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  backgroundColor: "#18216D"
};

export class InfiniteMaze extends Phaser.Game {
  constructor(config) {
    super(config);
  }
};

window.onload = () => {
  var game = new InfiniteMaze(config);
};
