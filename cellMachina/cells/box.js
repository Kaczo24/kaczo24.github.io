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