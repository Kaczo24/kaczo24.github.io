class Placer extends Cell {
    constructor(dir) {
        super();
        this.dir = dir;
        this.movable = true;
    }

    Update() {
        if(this.updated) return;
        this.updated = true;
        let c;
        if(c = GetCell(this.pos.sub(this.dir)))
            SetCell(this.pos.add(this.dir), new c.constructor(c.dir));
        toUpdate.splice(toUpdate.indexOf(this), 1);
    }

    Draw() {
        let tmp = this.getCorner();
        cx.fillStyle = "green";
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
}