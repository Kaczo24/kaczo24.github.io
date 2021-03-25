class Rotator extends Cell {
    constructor(dir) {
        super();
        this.dir = dir;
        this.movable = true;
    }

    Update() {
        if(this.updated) return;
        this.updated = true;
        let v = this.dir.y == 0 ? Math.PI / 2 : -Math.PI / 2;
        let c;
        if(c = GetCell(this.pos.add(new Vector(1, 0))))
            if(c.dir)
                c.dir = c.dir.rotate(v);
        if(c = GetCell(this.pos.add(new Vector(-1, 0))))
            if(c.dir)
                c.dir = c.dir.rotate(v);
        if(c = GetCell(this.pos.add(new Vector(0, 1))))
            if(c.dir) 
                c.dir = c.dir.rotate(v);
        if(c = GetCell(this.pos.add(new Vector(0, -1))))
            if(c.dir)
                c.dir = c.dir.rotate(v);
        toUpdate.splice(toUpdate.indexOf(this), 1);
        this.updated = true;
    }

    Draw() {
        let tmp = this.getCorner();
        cx.fillStyle = this.dir.y == 0 ? "#ffaa44" : "#ff8844";
        cx.fillRect(tmp.x, tmp.y, cellSize * zoom, cellSize * zoom);
    }
}