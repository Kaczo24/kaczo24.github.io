document.addEventListener('contextmenu', event => event.preventDefault());
let canvas = document.getElementById("canvas");
let cLog = document.getElementById("cLog");
let cx = canvas.getContext("2d");

const g = 1, distance = 120;
let width, height;

let nodes = [];
let running = true;

gameloop.INIT(Setup, Update);
gameloop.Start();
function Setup() {
  width = canvas.width = height = canvas.height = 900;
  cx.fileStyle = "black";
  nodes.push(new Node(0));
  for(let n = 0; n < 3; n++)
    nodes.push(new Node(Math.PI/2, nodes[n]));
  keyDownFunction[" "] = () => running = !running;
}

function Update() {
  if(!running)
    return;
  cx.backgroundFill('#e6e6e6');
  nodes.forEach(n => {
    n.addForce(new Vector(0, g));
  });
  //nodes[15].addForce(new Vector(0, -7))
  nodes[0].update()
  let e1 = 0, e2 = 0;
  nodes.forEach((n, m) => {
    e1 += n.avel * n.avel * distance * distance / 2;
    e2 += (100 + distance * m - n.pos.y) * g;
  });
  cLog.innerText = `Kin: ${e1.toFixed(2)}\nPot:${e2.toFixed(2)}\nCał:${(e1 + e2).toFixed(2)}`;
}