class Wall extends Cell {
    Draw() {
        let tmp = this.getCorner();
        cx.fillStyle = "black";
        cx.fillRect(tmp.x, tmp.y, cellSize * zoom, cellSize * zoom);
    }
}