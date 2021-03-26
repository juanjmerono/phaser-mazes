import "phaser";

export class GameScene extends Phaser.Scene {
  delta: number;
  lastStarTime: number;
  meters: number;
  walls: Phaser.Physics.Arcade.StaticGroup;
  info: Phaser.GameObjects.Text;
  player: Phaser.Physics.Arcade.Sprite;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  score: number = 0;
  gameOver: boolean = false;
  scoreText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(/*params: any*/): void {
    this.delta = 1000;
    this.lastStarTime = 0;
    this.meters = 0;
  }

  preload(): void {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
  }

  create(): void {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    //this.platforms.create(400, 568, 'ground').setScale(1).refreshBody();

    //  Now let's create some ledges
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    // The player and its settings
    this.player = this.physics.add.sprite(100, 450, 'dude');

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
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', backgroundColor: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(this.player, this.platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    //this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    //this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
  }
  
  update(time: number): void {
    if (this.cursors.left.isDown)
    {
        this.player.setVelocityX(-160);

        this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown)
    {
        this.player.setVelocityX(160);

        this.player.anims.play('right', true);
    }
    else
    {
        this.player.setVelocityX(0);

        this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown)
    {
        
        this.player.setVelocityY(-330);

    }  else if (this.cursors.down.isDown) {

        this.player.setVelocityY(330);

    }  else {

        this.player.setVelocityY(0);

    }
  }
  /*
  private onClick(star: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      star.setTint(0x00ff00);
      star.setVelocity(0, 0);
      this.starsCaught += 1;
      this.time.delayedCall(100, function (star) {
        star.destroy();
      }, [star], this);
    }
  }

  private onFall(star: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      star.setTint(0xff0000);
      this.starsFallen += 1;
      this.time.delayedCall(100, function (star) {
        star.destroy();
        if (this.starsFallen > 2) {
          this.scene.start("ScoreScene", { starsCaught: this.starsCaught });
        }
      }, [star], this);
    }
  }

  private emitStar(): void {
    var star: Phaser.Physics.Arcade.Image;
    var x = Phaser.Math.Between(25, 775);
    var y = 26;
    star = this.physics.add.image(x, y, "star");

    star.setDisplaySize(50, 50);
    star.setVelocity(0, 200);
    star.setInteractive();

    star.on('pointerdown', this.onClick(star), this);
    this.physics.add.collider(star, this.sand, this.onFall(star), null, this);
  }
  */
};