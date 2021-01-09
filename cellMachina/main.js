gameloop.init(setup, update)
let cx = document.getElementById("canvas").getContext("2d");
gameloop.start();


function setup() {
    cx.canvas.onClick = (e) => console.log(`Position: (${e.clientX}, ${e.clientY})`)
}

function update() {

}