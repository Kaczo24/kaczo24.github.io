document.addEventListener('contextmenu', event => event.preventDefault());
let canvas = document.getElementById("canvas");
let cx = canvas.getContext("2d");
let constLog = document.getElementById("constLog");

let width = canvas.width = window.innerWidth * 0.98, height = canvas.height = window.innerHeight * 0.98, center = new Vector(width/2, height/2);
const cellSize = 50;
const orderOfUpdates = [Mover];

let pos = new Vector();
let zoom = 1;
let mousePos = new Vector();
let isDraged = false, isOnBar = false;
let cells = {}, toUpdate = [];
let toPlace = "", placeRotation = new Vector(1, 0);
let framecount = 0;

let barsize = 0.08;

gameloop.INIT(Setup, Update);
gameloop.Start();
function Setup() {
    window.onmousewheel = Scroll;
    canvas.onmousemove = TrackPos;
    keyDownFunction[settings.keybinds.rotate] = () => placeRotation = placeRotation.rotate(Math.PI / 2);

    if(settings.darkmode) {
        document.body.bgColor = "#3f3f47";
        document.body.style.color = "white";
    }
}


function Update() {
    center.x = (width = canvas.width = window.innerWidth * 0.98) / 2;
    center.y = (height = canvas.height = window.innerHeight * 0.8) / 2;
    isDraged = false;
    isOnBar = mousePos.x < width * barsize;

    if(keyPressed[settings.keybinds.place] && !isOnBar) {
        if(toPlace == "")
            isDraged = true;
        else 
            PlaceCell();
    } 
    if(keyPressed[settings.keybinds.delete] && !isOnBar) {
        let _pos = ScreenToWorldPos(mousePos).div(cellSize).integerateR();
        DeleteCell(_pos);
    }


    Move();

    //if(framecount == 0) 
    //    CellUpdate()

    constLog.innerText = 
    `X: ${pos.x}; Y: ${pos.y}; Zoom: ${zoom}
    mouseX: ${mousePos.x}, mouseY: ${mousePos.y}
    placeX: ${ScreenToWorldPos(mousePos).div(cellSize).integerateR().x} placeY: ${ScreenToWorldPos(mousePos).div(cellSize).integerateR().y} rotationX: ${placeRotation.x} rotationY: ${placeRotation.y}`;

    Draw();


    framecount = (framecount + 1) % gameloop.framerate;
}

function Move() {
    let speed = 450 / gameloop.framerate / zoom;
    if(keyPressed[settings.keybinds.speedBoost])
        speed *= 3;
    if(keyPressed[settings.keybinds.forward])
        pos.y += speed;
    if(keyPressed[settings.keybinds.left])
        pos.x -= speed;
    if(keyPressed[settings.keybinds.backward])
        pos.y -= speed;
    if(keyPressed[settings.keybinds.right])
        pos.x += speed;
}

function CellUpdate() {
    for(let type of orderOfUpdates)
        for(let cs in cells) 
            for(let c in cells[cs]) 
                if(cells[cs][c] instanceof type)
                    toUpdate.push(cells[cs][c]);
    
    while (toUpdate.length > 0) toUpdate[0].Update();
}

function PlaceCell() {
    let _pos = ScreenToWorldPos(mousePos).div(cellSize).integerateR();
    switch(toPlace) {
        case "wall": SetCell(_pos, new Wall()); break;
        case "box": SetCell(_pos, new Box()); break;
        case "mover": SetCell(_pos, new Mover(placeRotation.copy())); break;
    }
}

function Draw() {
    cx.lineWidth = zoom;
    if(settings.darkmode) {
        cx.backgroundFill("#3f3f47");
        cx.strokeStyle = "#65656f"; 

    } else {
        cx.backgroundFill("#fff");
        cx.strokeStyle = "#000"; 
    }

    let cellSizeZ = cellSize * zoom;

    let nCells = new Vector(Math.ceil(width / cellSizeZ ) + 2, Math.ceil(height / cellSizeZ) + 2);
    if(nCells.x % 2 == 1) nCells.x += 1;
    if(nCells.y % 2 == 1) nCells.y += 1;

    for(let n = -1; n < nCells.x; n++) {
        for(let m = -1; m < nCells.y; m++) {
            let tmp = WorldToScreenPos(
                pos
                .add(new Vector(n, m).mult(cellSize))
                .sub(new Vector(pos.x % cellSize - cellSize/2, pos.y % cellSize - 3*cellSize/2))
                .sub(nCells.mult(cellSize/2))
            );
            cx.strokeRect(tmp.x, tmp.y, cellSizeZ, cellSizeZ);
        }
    }

    for(let cs in cells) {
        for(let c in cells[cs]) {
            cells[cs][c].Draw();
        }
    }

    cx.fillStyle = "rgba(130, 130, 130, 0.65)";
    cx.fillRect(0, 0, width * barsize, height);

    cx.fillStyle = "red";
    cx.circleFill(WorldToScreenPos(new Vector()), 5 * zoom);
}



function TrackPos(e) {
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
    if(isDraged) {
        pos = pos.add(new Vector(-e.movementX, e.movementY).div(zoom))
    }
}

function Scroll(e) {
    if(isOnBar) {  
        
    } else {
        let nPM = ScreenToWorldPos(mousePos);
        zoom *= 5;
        if(e.wheelDeltaY > 0 && zoom < 15) {
            pos = pos.sub(nPM).mult(zoom / (zoom + 1)).add(nPM);
            zoom++;
        }
        if(e.wheelDeltaY < 0 && zoom > 1) {
            pos = pos.sub(nPM).mult(zoom / (zoom - 1)).add(nPM);
            zoom--;
        }
        zoom /= 5; 
    }
}

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
