document.addEventListener('contextmenu', event => event.preventDefault());
let canvas = document.getElementById("canvas");
let cx = canvas.getContext("2d");

const g = 1, distance = 20;
let width, height;

let nodes = [];


gameloop.INIT(Setup, Update);
gameloop.Start();
function Setup() {
  width = canvas.width = height = canvas.height = 900;
  cx.fileStyle = "black";
  nodes.push(new Node(width/2, 100));
  for(let n = 0; n < 20; n++)
    nodes.push(new Node(nodes[n].pos.add(new Vector(0, distance).rotate(0.4)), nodes[n]));

}

function Update() {
  cx.backgroundFill('#e6e6e6');
  nodes.forEach(n => {
    n.addForce(new Vector(0, g));
  });
  //nodes[15].addForce(new Vector(0, -7))
  nodes.forEach(n => {
    n.update();
    n.draw();
  });
}