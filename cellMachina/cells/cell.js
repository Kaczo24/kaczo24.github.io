class Cell {
    pos = new Vector()
    movable = false;
    dir = new Vector(1, 0);
    updated = false;
    getCorner() {
        return  WorldToScreenPos(this.pos.mult(cellSize)).sub(new Vector(cellSize*zoom/2, cellSize*zoom/2));
    }

    Draw() {}
    Update() {}
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