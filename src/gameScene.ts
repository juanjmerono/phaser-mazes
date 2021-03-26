import "phaser";
import { Tilemaps } from "phaser";

export class Cell {
    x: number;
    y: number;
    maze: Maze;
    walls: boolean [] = [true,true,true,true];
    visited: boolean = false;

    constructor (m, i, j) {
        this.maze = m;
        this.x = j;
        this.y = i;
    }

    getIndex(i,j): number {
        return (i<0 || i >= this.maze.rows || j<0 || j >= this.maze.cols) ? -1 : i + j * this.maze.cols;
    }

    checkNeighbors(): Cell {
        let neighbors = []; 
        neighbors.push(this.maze.grid[this.getIndex(this.x,this.y-1)]);
        neighbors.push(this.maze.grid[this.getIndex(this.x-1,this.y)]);
        neighbors.push(this.maze.grid[this.getIndex(this.x,this.y+1)]);
        neighbors.push(this.maze.grid[this.getIndex(this.x+1,this.y)]);
        const notVisited = neighbors.filter(x => x && !x.visited);
        return notVisited[Math.floor(Math.random() * notVisited.length)];
    }

    draw(platforms): void {
        let offsetWL = this.x==0?2:0, offsetWR = this.x==this.maze.cols-1?-2:0;
        let offsetHT = this.y==0?2:0, offsetHB = this.y==this.maze.rows-1?-2:0;
        // top
        if (this.walls[0]) {
            platforms.add(this.maze.gameScene.add.line((this.x*this.maze.cellW) + this.maze.cellW/2, (this.y*this.maze.cellH) + offsetHT, this.maze.cellW, 0, 0, 0, this.maze.mazeColor));
        }
        // left
        if (this.walls[1]) {
            platforms.add(this.maze.gameScene.add.line((this.x*this.maze.cellW) + offsetWL, (this.y*this.maze.cellH) + this.maze.cellH/2, 0, this.maze.cellH, 0, 0, this.maze.mazeColor));
        }
        // bottom
        if (this.walls[2]) {
            platforms.add(this.maze.gameScene.add.line((this.x*this.maze.cellW) + this.maze.cellW/2, (this.y*this.maze.cellH) + this.maze.cellH + offsetHB, this.maze.cellW, 0, 0, 0, this.maze.mazeColor));
        }
        // right
        if (this.walls[3]) {
            platforms.add(this.maze.gameScene.add.line((this.x*this.maze.cellW) + this.maze.cellW + offsetWR, (this.y*this.maze.cellH) + this.maze.cellH/2, 0, this.maze.cellH, 0, 0, this.maze.mazeColor));
        }
        /*if (this.visited) {
            this.maze.gameScene.add.text(this.x*this.maze.cellW + 36, this.y*this.maze.cellH + 16, 'X', { fontSize: '26px', backgroundColor: '#000' });
        }*/
    }
}

export class Maze {
  cols: number;
  rows: number;
  mazeColor: number = 0x000044;
  gameScene: Phaser.Scene;
  cellH: number = 60;
  cellW: number = 80;
  grid: Cell[] = [];
  current: Cell;
  stack: Cell[] = [];

  constructor(scene) {
    this.gameScene = scene;
    this.cols = this.gameScene.sys.game.canvas.width/this.cellW;
    this.rows = this.gameScene.sys.game.canvas.height/this.cellH;
    for (let i = 0; i < this.rows; i++) {
        for (let j=0; j < this.cols; j++) {
            this.grid.push(new Cell(this,i,j));
        }
    }
    this.current = this.grid[0];
    this.current.visited = true;
    while (this.current) {
        this.updateCurrent();
    }
  }

  draw(): Phaser.Physics.Arcade.StaticGroup {
    let platforms = this.gameScene.physics.add.staticGroup();
    this.grid.forEach(c=>c.draw(platforms));
    return platforms;
  }

  removeWallsBetween(a,b): void {
    if (a.x == b.x) {
        // top / bottom
        if (a.y == b.y + 1) {
            a.walls[0] = false;
            b.walls[2] = false;
        } else {
            a.walls[2] = false;
            b.walls[0] = false;
        }
    } else {
        // left / right
        if (a.x == b.x + 1) {
            a.walls[1] = false;
            b.walls[3] = false;
        } else {
            a.walls[3] = false;
            b.walls[1] = false;
        }
    }
  }

  updateCurrent(): void {
    if (this.current) {
        let next = this.current.checkNeighbors();
        if (next) {
            next.visited = true;
            this.stack.push(this.current);
            this.removeWallsBetween(this.current,next);
        } else if (this.stack.length>0) {
            next = this.stack.pop();
        }
        this.current = next;
    }
  }

};


export class GameScene extends Phaser.Scene {
  delta: number;
  lastStarTime: number;
  meters: number;
  walls: Phaser.Physics.Arcade.StaticGroup;
  info: Phaser.GameObjects.Text;
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
    this.delta = 1000;
    this.lastStarTime = 0;
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

    // The player and its settings
    this.player = this.physics.add.sprite(20, 20, 'dude');

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

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(this.player, this.mazeWalls);

    // The star
    this.star = this.physics.add.image(this.sys.game.canvas.width - 20, this.sys.game.canvas.height - 20, 'star');

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(this.player, this.star, this.starFound, null, this);

    //this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
  }
  
  update(time: number): void {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.anims.play('right', true);
    } else {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
    }
    if (this.cursors.up.isDown)  {
        this.player.setVelocityY(-330);
    }  else if (this.cursors.down.isDown) {
        this.player.setVelocityY(330);
    }  else {
        this.player.setVelocityY(0);
    }
  }

  starFound(): void {
    this.scene.restart();
  }

};