let gameloop = (() => {
    
    function Start() {
        gameloop.Setup();
        window.requestAnimationFrame(Loop);
    }

    function Loop(timestamp) {
        gameloop.Update();
        let wait = (1000 / gameloop.framerate) - (performance.now() - timestamp);
        if(wait > 0)
            setTimeout(() => window.requestAnimationFrame(Loop), wait)
        else
            window.requestAnimationFrame(Loop)
      }


    return {
        "Setup": null,
        "Update": null,
        "framerate": null,
        "INIT": ((setup, update, framerate = 30) => {
            gameloop.Setup = setup;
            gameloop.Update = update;
            gameloop.framerate = framerate;
        }),
        "Start": (() => {
            if(gameloop.Setup && gameloop.Update && gameloop.framerate)
                Start();
        })
    };
})();

// drawing --------------------------------------------------------------------------------------------------------------

CanvasRenderingContext2D.prototype.line = function(x1, y1, x2, y2) {
    if(x1 instanceof Vector && y1 instanceof Vector) {
        this.moveTo(x1.x, x1.y);
        this.lineTo(y1.x, y1.y);
    } else {
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
    }
    this.stroke();
 }

 CanvasRenderingContext2D.prototype.backgroundFill = function(c) {
    let b = this.fillStyle;
    this.fillStyle = c;
    this.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.fillStyle = b;
 }

CanvasRenderingContext2D.prototype.circle = function(x, y, r) {
    this.beginPath();
    if(x instanceof Vector)
        this.arc(x.x, x.y, y, 0, 2 * Math.PI);
    else
        this.arc(x, y, r, 0, 2 * Math.PI);
    this.stroke();
}
CanvasRenderingContext2D.prototype.circleFill = function(x, y, r) {
    this.beginPath();
    if(x instanceof Vector)
        this.arc(x.x, x.y, y, 0, 2 * Math.PI);
    else
        this.arc(x, y, r, 0, 2 * Math.PI);
    this.fill();
}

// keys --------------------------------------------------------------------------------------------------------------
let keyPressed = {}, keyDownFunction = {};
function dLib_keydown(event) {
    keyPressed[event.key.toLowerCase()] = true;
    if(keyDownFunction[event.key.toLowerCase()])
        keyDownFunction[event.key.toLowerCase()]();
 }
 function dLib_keyup(event) {
    keyPressed[event.key.toLowerCase()] = false;
 }
 function dLib_mousedown(event) {
    keyPressed['mouse' + event.button] = true;
 }
 function dLib_mouseup(event) {
    keyPressed['mouse' + event.button] = false;
 }

 
 window.onkeydown = dLib_keydown;
 window.onkeyup = dLib_keyup;
 window.onmousedown = dLib_mousedown;
 window.onmouseup = dLib_mouseup;


// utility classes --------------------------------------------------------------------------------------------------------------


class Vector {
    x = 0
    y = 0
    z = 0
    constructor(x, y, z) {
        if(x) 
            this.x = x;
        if(y) 
            this.y = y;
        if(z) 
            this.z = z;
        
    }

    get mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    mult(a) {
        return new Vector(this.x * a, this.y * a);
    }
    div(a) {
        return new Vector(this.x / a, this.y / a);
    }

    dot(a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }

    integerate() {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }

    integerateR() {
        return new Vector(Math.round(this.x), Math.round(this.y));
    }

    rotate(a) {
        return new Vector(this.x * Math.cos(a) - this.y * Math.sin(a), this.x * Math.sin(a) + this.y * Math.cos(a)).integerateR();
    }

    normalize() {
        return this.div(this.mag);
    }

    copy() {
        return new Vector(this.x, this.y, this.z);
    }

    toString() {
        return `{x: ${this.x}, y: ${this.y}, z: ${this.z}}`;
    }

}

console.log("dLib loaded");
