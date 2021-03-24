function WorldToScreenPos(_pos) {
    let newX = center.x + _pos.x - pos.x;
    let newY = center.y - _pos.y + pos.y;
    return new Vector(newX, newY).sub(center).mult(zoom).add(center);
} 

function ScreenToWorldPos(_pos) {
    _pos = _pos.sub(center).div(zoom).add(center);
    let newX = _pos.x + pos.x - center.x;
    let newY = center.y + pos.y - _pos.y;
    return new Vector(newX, newY);
}

function PlaceCell() {
    let _pos = ScreenToWorldPos(mousePos).div(cellSize).integerateR();
    switch(toPlace) {
        case "wall": SetCell(_pos, new Wall()); break;
        case "box": SetCell(_pos, new Box()); break;
        case "mover": SetCell(_pos, new Mover(placeRotation.copy())); break;
        case "rotator": SetCell(_pos, new Rotator(placeRotation.copy())); break;
    }
}

function GetCell(_pos) {
    if(!cells[_pos.x])
        return undefined;
    if(!cells[_pos.x][_pos.y]) 
        return undefined;
    return cells[_pos.x][_pos.y];
}

function SetCell(_pos, s) {
    s.pos = _pos.copy();
    if(!cells[_pos.x]){
        cells[_pos.x] = {};
        cells[_pos.x][_pos.y] = s;
    } else if(!cells[_pos.x][_pos.y]) 
    cells[_pos.x][_pos.y] = s; 
}

function DeleteCell(_pos) {
    try {
        delete cells[_pos.x][_pos.y];
    } catch (error) {}      
}