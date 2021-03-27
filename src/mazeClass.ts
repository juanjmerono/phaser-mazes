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

    inside(): any {
        return { x: this.x*this.maze.cellW + 20, y: this.y*this.maze.cellH + 30 };
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

  randomCell(): Cell {
    return this.grid[Math.floor(Math.random() * this.grid.length)];
  }

};