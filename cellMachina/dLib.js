let gameloop = (() => {
    
    function start() {
        gameloop.setup();
        window.requestAnimationFrame(loop);
    }

    function loop(timestamp) {
        gameloop.update();
        let wait = (1000 / gameloop.framerate) - (performance.now() - timestamp);
        if(wait > 0)
            setTimeout(() => window.requestAnimationFrame(loop), wait)
        else
            window.requestAnimationFrame(loop)
      }


    return {
        "setup": null,
        "update": null,
        "framerate": null,
        "init": ((setup, update, framerate = 30) => {
            gameloop.setup = setup;
            gameloop.update = update;
            gameloop.framerate = framerate;
        }),
        "start": (() => {
            if(gameloop.setup && gameloop.update && gameloop.framerate)
                start();
        })
    };
})();

CanvasRenderingContext2D.prototype.line = function(x1, y1, x2, y2) {
    this.moveTo(x1,y2);
    this.lineTo(x2,y2);
    this.stroke();
 }

CanvasRenderingContext2D.prototype.circle = function(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
}

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

console.log("dLib loaded");
