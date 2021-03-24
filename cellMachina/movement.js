let pos = new Vector();
let zoom = 1;
let mousePos = new Vector();

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