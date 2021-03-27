import "phaser";
import { Tilemaps } from "phaser";
import { Maze,Cell } from "./mazeClass";
import { TfModel } from "./tfModel";

export class GameScene extends Phaser.Scene {
  walls: Phaser.Physics.Arcade.StaticGroup;
  info: Phaser.GameObjects.Text;
  bots: Phaser.Physics.Arcade.Group;
  player: Phaser.Physics.Arcade.Sprite;
  mazeWalls: Phaser.Physics.Arcade.StaticGroup;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  score: number = 0;
  gameOver: boolean = false;
  scoreText: Phaser.GameObjects.Text;
  maze: Maze;
  star: Phaser.Physics.Arcade.Image;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(/*params: any*/): void {
    this.maze = new Maze(this);
  }

  preload(): void {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 } );
  }

  create(): void {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.mazeWalls = this.maze.draw();

    this.bots = this.addBots();

    // The player and its settings
    let rCell = this.maze.randomCell().inside();
    this.player = this.physics.add.sprite(rCell.x, rCell.y, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    //this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    //  The score
    //this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', backgroundColor: '#000' });

    // The star
    this.star = this.physics.add.image(this.sys.game.canvas.width - 20, this.sys.game.canvas.height - 20, 'star');


    //  Collide the player and the stars with the platforms
    this.physics.add.collider(this.bots, this.mazeWalls);
    this.physics.add.collider(this.player, this.mazeWalls);
    this.physics.add.collider(this.star, this.mazeWalls);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(this.bots, this.star, this.starFound, null, this);
    this.physics.add.overlap(this.player, this.star, this.starFound, null, this);

    //this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
  }
  
  update(time: number): void {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-120);
        this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(120);
        this.player.anims.play('right', true);
    } else {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
    }
    if (this.cursors.up.isDown)  {
        this.player.setVelocityY(-300);
    }  else if (this.cursors.down.isDown) {
        this.player.setVelocityY(300);
    }  else {
        this.player.setVelocityY(0);
    }
  }

  starFound(): void {
    //this.scene.restart();
    this.scene.start("ScoreScene",{ starsCaught: 10 });
  }

  addBots(): Phaser.Physics.Arcade.Group {
    let botGrp = this.physics.add.group();
    botGrp.runChildUpdate = true;
    for (let i=0; i<2; i++) {
        let mazeCell = this.maze.randomCell().inside();
        let bot = this.physics.add.sprite(mazeCell.x, mazeCell.y, 'dude');
        botGrp.add(bot);//.create(mazeCell.x, mazeCell.y, 'dude');
        //bot.model = new TfModel();
        bot.update = function() {
            //console.log('Update: ');
            this.setVelocityX(120);
            this.anims.play('right', true);
        };
        bot.setCollideWorldBounds(true);
    }
    return botGrp;
  }

};