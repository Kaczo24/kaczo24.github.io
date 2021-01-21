class Cell {
    pos = new Vector()
    movable = false;
    getCorner() {
        return  WorldToScreenPos(this.pos.mult(cellSize)).sub(new Vector(cellSize*zoom/2, cellSize*zoom/2));
    }

    Draw() {}
    Update() {}
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
        MoveCell(this.pos, this.dir, false, 0);
        toUpdate.splice(toUpdate.indexOf(this), 1);
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

    toString() {
        return "Mover" + this.pos.x;
    } 
}

function MoveCell(_pos, dir, forceUpdate, index) {
    let b;
    if(GetCell(_pos.add(dir))) {
        if(!GetCell(_pos.add(dir)).movable)
            return true;
        b = MoveCell(_pos.add(dir), dir, true, index + 1)
    }

    if(forceUpdate && toUpdate.includes(GetCell(_pos)))
        GetCell(_pos).Update();
    
    if(index > 5 || (b && GetCell(_pos.add(dir))))
        return true;
    
    if(GetCell(_pos)) {
        SetCell(_pos.add(dir), GetCell(_pos));
        DeleteCell(_pos);
    }
    return false;
}