document.addEventListener('contextmenu', event => event.preventDefault());
let canvas = document.getElementById("canvas");
let cx = canvas.getContext("2d");
let constLog = document.getElementById("constLog");

const width = canvas.width, height = canvas.height, center = new Vector(width/2, height/2);
const cellSize = 50;
const orderOfUpdates = [Mover];

let pos = new Vector();
let zoom = 1;
let mousePos = new Vector();
let isDraged = false, isPlacing = false, isDeleting = false;
let cells = {}, postCells = {};
let toPlace = "";
let framecount = 0;


gameloop.INIT(Setup, Update);
gameloop.Start();
function Setup() {
    window.onmousewheel = Scroll;

    canvas.onmousemove = TrackPos;

    if(settings.darkmode) {
        document.body.bgColor = "#3f3f47";
        document.body.style.color = "white";
    }
}


function Update() {
    
    Move();

    if(framecount == 0) 
        CellUpdate()

    if(isPlacing) 
        PlaceCell();

    if(isDeleting) {
        let _pos = ScreenToWorldPos(mousePos).div(cellSize).integerateR();
        DeleteCell(_pos, cells);
    }

    constLog.innerText = `X: ${pos.x}; Y: ${pos.y}; Zoom: ${zoom}\nmouseX: ${mousePos.x}, mouseY: ${mousePos.y}`
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
    let toUpdate = [];
    for(let type of orderOfUpdates)
        for(let cs in cells) 
            for(let c in cells[cs]) 
                if(cells[cs][c] instanceof type)
                    toUpdate.push(cells[cs][c]);

    for(let c of toUpdate)
        c.Update();
    
    for(let cs in postCells) 
        for(let c in postCells[cs]) 
            SetCell(postCells[cs][c].pos, postCells[cs][c], cells);

    postCells = {};
}

function PlaceCell() {
    let _pos = ScreenToWorldPos(mousePos).div(cellSize).integerateR();
    SetCell(_pos, new Wall(), cells);
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
    let nPM = ScreenToWorldPos(mousePos);
    zoom *= 5;
    if(e.wheelDeltaY > 0 && zoom < 10) {
        pos = pos.sub(nPM).mult(zoom / (zoom + 1)).add(nPM);
        zoom++;
    }
    if(e.wheelDeltaY < 0 && zoom > 1) {
        pos = pos.sub(nPM).mult(zoom / (zoom - 1)).add(nPM);
        zoom--;
    }
    zoom /= 5; 
}

function OnClickS(e)
{
    if(e.button == settings.keybinds.place) {
        isPlacing = false;
        isDraged = false;
        if(toPlace == "")
            isDraged = true;
        else 
            isPlacing = true;
    } 
    if(e.button == settings.keybinds.delete) 
        isDeleting = true;
}

function OnClickE(e)
{
    if(e.button == settings.keybinds.place) {
        isDraged = false;
        isPlacing = false;
    } 
    if(e.button == settings.keybinds.delete) 
        isDeleting = false;
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
    if(!cells[_pos.x]) {
        if(!postCells[_pos.x])
            return undefined;
        if(!postCells[_pos.x][_pos.y])
            return undefined;
        return postCells[_pos.x][_pos.y];
    }
    if(!cells[_pos.x][_pos.y]) {
        if(!postCells[_pos.x])
            return undefined;
        if(!postCells[_pos.x][_pos.y])
            return undefined;
        return postCells[_pos.x][_pos.y];
    }
    return cells[_pos.x][_pos.y];
}

function SetCell(_pos, s, grid) {
    s.pos = _pos.copy();
    if(!grid[_pos.x]){
        grid[_pos.x] = {};
        grid[_pos.x][_pos.y] = s;
    } else if(!grid[_pos.x][_pos.y]) 
        grid[_pos.x][_pos.y] = s; 
}

function DeleteCell(_pos, grid) {
    try {
        delete grid[_pos.x][_pos.y];
    } catch (error) {}      
}
