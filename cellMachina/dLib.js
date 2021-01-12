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
let keyPressed = {};
function dLib_keydown(event) {
    keyPressed[event.key.toLowerCase()] = true;
    //console.log("starts " + event.key);
 }
 function dLib_keyup(event) {
    keyPressed[event.key.toLowerCase()] = false;
    //console.log("ends " + event.key);
 }
 
 window.addEventListener("keydown", dLib_keydown, false)
 window.addEventListener("keyup", dLib_keyup, false)

// utility classes --------------------------------------------------------------------------------------------------------------
/*class Color {
    r=0
    g=0
    b=0
    a=255
    constructor(v1, v2, v3, v4) {
        if(typeof(v1) == "string") {
            if(/^#([0-9a-fA-F]{3})$/.test(v1)) {
                this.r = parseInt(v1[1] + v1[1], 16);
                this.g = parseInt(v1[2] + v1[2], 16);
                this.b = parseInt(v1[3] + v1[3], 16);
            } else if (/^#([0-9a-fA-F]{6})$/.test(v1)) {
                this.r = parseInt(v1[1] + v1[2], 16);
                this.g = parseInt(v1[3] + v1[4], 16);
                this.b = parseInt(v1[5] + v1[6], 16);
            }
        } else if(typeof(v1) == "number") {
            if(typeof(v2) == "number" && typeof(v3) == "number") {
                this.r = v1;
                this.g = v2;
                this.b = v3;
                if(typeof(v4) == "number")
                    this.a = v4;
            } else if(typeof(v2) == "number") {
                this.r = v1;
                this.g = v1;
                this.b = v1;
                this.a = v2;
            } else {
                this.r = v1;
                this.g = v1;
                this.b = v1;
            }
        }
    }
 
}*/

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

    integerate() {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }

    integerateR() {
        return new Vector(Math.round(this.x), Math.round(this.y));
    }

    copy() {
        return new Vector(this.x, this.y, this.z);
    }

    toString() {
        return `{x: ${this.x}, y: ${this.y}, z: ${this.z}}`;
    }

}

console.log("dLib loaded");
