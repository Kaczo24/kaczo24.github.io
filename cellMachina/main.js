document.addEventListener('contextmenu', event => event.preventDefault());
let canvas = document.getElementById("canvas");
let cx = canvas.getContext("2d");
let constLog = document.getElementById("constLog");

const width = canvas.width, height = canvas.height, center = new Vector(width/2, height/2);
let pos = new Vector();
let zoom = 1;
let mousePos = new Vector();
let isDraged = false;




gameloop.INIT(Setup, Update);
gameloop.Start();

function Setup() {
    canvas.onmousewheel = Scroll;
    canvas.onmousedown = OnClickS;
    canvas.onmouseup = OnClickE;
    canvas.onmousemove = TrackPos;
}

function Update() {
    
    Move();

    constLog.innerText = `X: ${pos.x}; Y: ${pos.y}; Zoom: ${zoom}\nmouseX: ${mousePos.x}, mouseY: ${mousePos.y}`
    Draw();
}

function Draw() {
    cx.backgroundFill("#fff");
    cx.strokeStyle = "#000"; 
    cx.lineWidth = zoom;
    cx.fillStyle = "#bbb";
    let cellSize = 50;
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

    cx.fillStyle = "#f00";

    cx.circleFill(WorldToScreenPos(new Vector(00, 00)), 5 * zoom);
    cx.circleFill(WorldToScreenPos(new Vector(00, 50)), 5 * zoom);
    cx.circleFill(WorldToScreenPos(new Vector(0, -50)), 5 * zoom);
    cx.circleFill(WorldToScreenPos(new Vector(50, 00)), 5 * zoom);
    cx.circleFill(WorldToScreenPos(new Vector(-50, 0)), 5 * zoom);

    cx.circleFill(WorldToScreenPos(new Vector(00, 00).add(new Vector(300, 0))), 5 * zoom);
    cx.circleFill(WorldToScreenPos(new Vector(00, 50).add(new Vector(300, 0))), 5 * zoom);
    cx.circleFill(WorldToScreenPos(new Vector(0, -50).add(new Vector(300, 0))), 5 * zoom);
    cx.circleFill(WorldToScreenPos(new Vector(50, 00).add(new Vector(300, 0))), 5 * zoom);
    cx.circleFill(WorldToScreenPos(new Vector(-50, 0).add(new Vector(300, 0))), 5 * zoom);
}

function Move() {
    let speed = 7 / zoom;
    if(keyPressed["shift"])
        speed *= 3;
    if(keyPressed["w"])
        pos.y += speed;
    if(keyPressed["a"])
        pos.x -= speed;
    if(keyPressed["s"])
        pos.y -= speed;
    if(keyPressed["d"])
        pos.x += speed;

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
    console.log(e.button);
    if(e.button == 2) {
        isDraged = true;
    }
}

function OnClickE(e)
{
    console.log(e.button);
    if(e.button == 2) {
        isDraged = false;
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
