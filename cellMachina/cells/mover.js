class Mover extends Cell {
    dir = new Vector(1, 0);
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