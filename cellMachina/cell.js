class Cell {
    pos = new Vector()
    movable = false;
    getCorner() {
        return  WorldToScreenPos(this.pos.mult(cellSize)).sub(new Vector(cellSize*zoom/2, cellSize*zoom/2));
    }

    Draw(){}
    Update() {}

    copy() {
        let c = new this.constructor();
        c.pos = this.pos.copy();
        return c;
    }
}

class Wall extends Cell {
    Draw() {
        let tmp = this.getCorner();
        cx.fillStyle = "black";
        cx.fillRect(tmp.x, tmp.y, cellSize * zoom, cellSize * zoom);
    }
}

class Box extends Cell {
    constructor() {
        super();
        this.movable = true;
    }

    Draw() {
        let tmp = this.getCorner();
        cx.fillStyle = "wheat";
        cx.fillRect(tmp.x, tmp.y, cellSize * zoom, cellSize * zoom);
    }
}

class Mover extends Cell {
    dir = new Vector(1, 0)
    constructor(dir) {
        super();
        this.dir = dir;
        this.movable = true;
    }

    Update() {
        if(CheckMovement(this.pos, this.dir, 0)) 
            MoveCell(this.pos, this.dir, true)
    }

    Draw() {
        let tmp = this.getCorner();
        cx.fillStyle = "blue";
        cx.fillRect(tmp.x, tmp.y, cellSize * zoom, cellSize * zoom);
        cx.fillStyle = "white";
        if(this.dir.x == 1) {
            tmp = WorldToScreenPos(this.pos.mult(cellSize)).sub(new Vector(cellSize*zoom/10, cellSize*zoom/10));
            cx.fillRect(tmp.x, tmp.y, cellSize * zoom / 2, cellSize * zoom / 5);
        } else if(this.dir.x == -1) {
            tmp = WorldToScreenPos(this.pos.mult(cellSize)).sub(new Vector(cellSize*zoom*4/10, cellSize*zoom/10));
            cx.fillRect(tmp.x, tmp.y, cellSize * zoom / 2, cellSize * zoom / 5);
        } else if(this.dir.y == 1) {
            tmp = WorldToScreenPos(this.pos.mult(cellSize)).sub(new Vector(cellSize*zoom/10, cellSize*zoom*4/10));
            cx.fillRect(tmp.x, tmp.y, cellSize * zoom / 5, cellSize * zoom / 2);
        } else if(this.dir.y == -1) {
            tmp = WorldToScreenPos(this.pos.mult(cellSize)).sub(new Vector(cellSize*zoom/10, cellSize*zoom/10));
            cx.fillRect(tmp.x, tmp.y, cellSize * zoom / 5, cellSize * zoom / 2);
        }

    }

    copy() {
        let c = new this.constructor(this.dir.copy());
        c.pos = this.pos.copy();
        return c;
    }
}

function CheckMovement(_pos, dir, index) {
    if(index > 5)
        return false;
    let c = GetCell(_pos.add(dir))
    if(!c)
        return true;
    if(!c.movable)
        return false;
    return CheckMovement(_pos.add(dir), dir, index + 1);
}

function MoveCell(_pos, dir, actor) {
    if(GetCell(_pos.add(dir)))
        MoveCell(_pos.add(dir), dir, false);
    if(actor)
        SetCell(_pos.add(dir), GetCell(_pos), postCells);
    else
        SetCell(_pos.add(dir), GetCell(_pos), cells);
    DeleteCell(_pos, cells);
}