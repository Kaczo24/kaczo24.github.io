document.addEventListener('contextmenu', event => event.preventDefault());
let canvas = document.getElementById("canvas");
let cx = canvas.getContext("2d");
let constLog = document.getElementById("constLog");

let width = canvas.width = window.innerWidth * 0.98, height = canvas.height = window.innerHeight * 0.98, center = new Vector(width/2, height/2);
let barsize = 0.08;
const cellSize = 50;

const updateDelay = 2/3;
const placables = ["wall", "box", "mover", "rotator", "placer", "destructor"],
 orderOfUpdates = [Mover, Rotator, Placer, Destructor];
let isDraged = false, isOnBar = false, isPlaying = true;
let cells = {}, toUpdate = [];
let toPlace = "", placeRotation = new Vector(1, 0);

let framecount = 0;
gameloop.INIT(Setup, Update);
gameloop.Start();
function Setup() {
    window.onmousewheel = Scroll;
    canvas.onmousemove = TrackPos;
    keyDownFunction[settings.keybinds.rotate] = () => placeRotation = placeRotation.rotate(Math.PI / 2);
    keyDownFunction[settings.keybinds.pause] = () => { isPlaying = !isPlaying; canvas.style.border = (isPlaying ? 1 : 4) + "px solid black"};

    for(let n = 0; n < placables.length; n++)
        keyDownFunction[n+1] = () => toPlace = placables[n];
    keyDownFunction["escape"] = () => toPlace = "";

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

    if(framecount == 0 && isPlaying) 
        CellUpdate();
    if(isPlaying)
        framecount = (framecount + 1) % Math.round(gameloop.framerate * updateDelay);
    
    Move();
    Draw();

    constLog.innerText = 
    `X: ${pos.x}; Y: ${pos.y}; Zoom: ${zoom}
    mouseX: ${mousePos.x}, mouseY: ${mousePos.y}
    placeX: ${ScreenToWorldPos(mousePos).div(cellSize).integerateR().x} placeY: ${ScreenToWorldPos(mousePos).div(cellSize).integerateR().y} rotationX: ${placeRotation.x} rotationY: ${placeRotation.y}`;
}

function CellUpdate() {
    for(let type of orderOfUpdates)
        for(let cs in cells) 
            for(let c in cells[cs]) 
                if(cells[cs][c] instanceof type) {
                    cells[cs][c].updated = false;
                    toUpdate.push(cells[cs][c]);
                }
    while (toUpdate.length > 0) toUpdate[0].Update();
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

    for(let n = -1; n < nCells.x; n++)
        for(let m = -1; m < nCells.y; m++) {
            let tmp = WorldToScreenPos(pos
                .add(new Vector(n, m).mult(cellSize))
                .sub(new Vector(pos.x % cellSize - cellSize/2, pos.y % cellSize - 3*cellSize/2))
                .sub(nCells.mult(cellSize/2)));
            cx.strokeRect(tmp.x, tmp.y, cellSizeZ, cellSizeZ);
        }

    if(!isOnBar && toPlace != "") {
        let _pos = ScreenToWorldPos(mousePos).div(cellSize).integerateR();
        if(!GetCell(_pos)) {
            PlaceCell();
            let c = GetCell(_pos);
            cx.globalAlpha = 0.5;
            c.Draw();
            cx.globalAlpha = 1;
            DeleteCell(_pos);
        }
    }

    for(let cs in cells) {
        for(let c in cells[cs]) {
            cells[cs][c].Draw();
        }
    }

    cx.fillStyle = "rgba(130, 130, 130, 0.65)";
    cx.fillRect(0, 0, width * barsize, height);
}