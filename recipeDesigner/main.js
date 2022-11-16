let EraSlider;
new ResizeObserver(() => EraSlider.style.width = EraSlider.parentElement.clientHeight + "px").observe((EraSlider = document.getElementById("eraSlider")).parentElement);
let flag = 0;
let eraCount = 1;
let currentEra = 0;

let nodesConnectionsNames = {}, colorValues = {};

function init() {

    // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
    // For details, see https://gojs.net/latest/intro/buildingObjects.html
    const $ = go.GraphObject.make;  // for conciseness in defining templates

    var yellowgrad = $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" });
    var bluegrad = $(go.Brush, "Linear", { 0: "#B0E0E6", 1: "#87CEEB" });

    var hugefont = "bold 16pt Helvetica, Arial, sans-serif";
    var bigfont = "bold 13pt Helvetica, Arial, sans-serif";
    var smallfont = "bold 11pt Helvetica, Arial, sans-serif";

    // Common text styling
    function textStyle() {
        return {
            margin: 6,
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            editable: true,
            font: bigfont
        }
    }

    myDiagram =
        $(go.Diagram, "myDiagramDiv", {
            // have mouse wheel events zoom in and out instead of scroll up and down
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            initialAutoScale: go.Diagram.Uniform,
            "linkingTool.direction": go.LinkingTool.ForwardsOnly,
            layout: $(go.LayeredDigraphLayout, { isInitial: false, isOngoing: false, layerSpacing: 50 }),
            "undoManager.isEnabled": true,
            "toolManager.hoverDelay": 100
        });

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", e => {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
            if (idx < 0) document.title += "*";
        } else {
            if (idx >= 0) document.title = document.title.slice(0, idx);
        }
    });

    var tooltiptemplate =
        $("ToolTip",
          { "Border.fill": "whitesmoke", "Border.stroke": "black" },
          $(go.TextBlock,
            {
              font: "bold 8pt Helvetica, bold Arial, sans-serif",
              wrap: go.TextBlock.WrapFit,
              margin: 5
            },
            new go.Binding("text", "text", (nName)=> nodesConnectionsNames[nName]?.join("\n") ?? ""))
        );

    // define the Node template
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",
            { toolTip: tooltiptemplate },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            // define the node's outer shape, which will surround the TextBlock
            $(go.Shape, "RoundedRectangle",
                {
                    fill: bluegrad, stroke: "black", strokeWidth: 6,
                    portId: "shape", fromLinkable: true, toLinkable: true, cursor: "pointer",
                    toEndSegmentLength: 50, fromEndSegmentLength: 40
                }),
            $(go.TextBlock, "Perk",
                {
                    margin: 6,
                    font: bigfont,
                    editable: true
                },
                new go.Binding("text", "text").makeTwoWay()));

    myDiagram.nodeTemplateMap.add("Effect",
        $(go.Node, "Auto",
            { toolTip: tooltiptemplate },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, "RoundedRectangle",
                {
                    fill: yellowgrad, stroke: "black", strokeWidth: 6,
                    portId: "shape", fromLinkable: true, toLinkable: true, cursor: "pointer", fromEndSegmentLength: 40
                }),
            $(go.TextBlock, "Effect",
                {
                    margin: 10,
                    font: hugefont,
                    editable: true
                },
                new go.Binding("text", "text").makeTwoWay())
        ));

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
            new go.Binding("points").makeTwoWay(),
            { curve: go.Link.Bezier, toShortLength: 15 },
            new go.Binding("curviness", "curviness"),
            $(go.Shape,  // the link shape
                { stroke: "#60a0a0", strokeWidth: 2.5 }),
            $(go.Shape,  // the arrowhead
                { toArrow: "kite", fill: "#60a0a0", stroke: null, scale: 2 })
        );




    var palette =
        $(go.Palette, "myPaletteDiv",  // create a new Palette in the HTML DIV element
            {
                // share the template map with the Palette
                nodeTemplateMap: myDiagram.nodeTemplateMap,
                autoScale: go.Diagram.Uniform  // everything always fits in viewport
            });

    palette.model.nodeDataArray = [
        {}, // default node
        { category: "Effect" }
    ];
}

function layout() { myDiagram.layoutDiagram(true); }

// Show the diagram's model in JSON format
function save() {
    update(document.getElementById("mySavedModel").value = myDiagram.model.toJson());
    myDiagram.isModified = false;
}
function load() {
    let text;
    myDiagram.model = go.Model.fromJson(text = document.getElementById("mySavedModel").value)
    update(text);
}
function update(json) {
    window.localStorage.setItem("graph", json);
    let obj = JSON.parse(json);
    let node2name = {}, product2components = {};
    obj.nodeDataArray.forEach(x => node2name[x.key] = x.text);
    obj.linkDataArray.forEach(x => product2components[x.to] = [...(product2components[x.to] ?? []), x.from])
    document.getElementById("mySavedConnections").value = Object.entries(product2components).map(([key, [a, b]]) => `${node2name[a]} + ${node2name[b]} = ${node2name[key]}`).join("\n");
    nodesConnectionsNames = Object.fromEntries(Object.entries(product2components).map(([key, [v1, v2]]) => [node2name[key], [node2name[v1], node2name[v2]]]));
    console.log(nodesConnectionsNames);
}

function setsUpdate() {
    const numtocol = (n) => `#${((n & 1) == 1) ? "ff" : "00"}${((n & 2) == 2) ? "ff" : "00"}${((n & 4) == 4) ? "ff" : "00"}`;

    let sets;
    window.localStorage.setItem("sets", sets = document.getElementById("sets").value);

    let excludes = sets.split("\n---\n")[currentEra].split("\n").filter(x=>x.startsWith("!")).map(y => { let z = y.split("-"); return { perk: z[0].slice(1), color: z[1] == "R" ? 1 : (z[1] == "G" ? 2 : 4) } });
    EraSlider.max = sets.split("---").length - 1;
    sets = sets.split("\n---\n").slice(0, +currentEra+1).join("\n").split("\n").filter(x=>!x.startsWith("!") && x!="").map(x => x.split(" ").map(y => { let z = y.split("-"); return { perk: z[0], color: z[1] == "R" ? 1 : (z[1] == "G" ? 2 : 4) } }));


    let req = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    sets.forEach(x => req[x.reduce((p, n) => p | n.color, 0)]++);

   
    sets = sets.reduce((p, n) => [...p, ...n], []);

    let obj = JSON.parse(document.getElementById("mySavedModel").value);
    let node2name = {}, product2componentsNames = {};
    obj.nodeDataArray.forEach(x => node2name[x.key] = x.text);
    obj.linkDataArray.forEach(x => product2componentsNames[node2name[x.to]] = [...(product2componentsNames[node2name[x.to]] ?? []), node2name[x.from]])
    node2name = Object.fromEntries(Object.entries(node2name).map(([a, b]) => [b, a]));
    let value = {};
    Object.keys(node2name).forEach(x => value[x] = 0);
    Object.values(sets).forEach(({ perk, color }) => value[perk] |= color);

    const tree = (name) => {
        if (product2componentsNames[name]) {
            tree(product2componentsNames[name][0]);
            tree(product2componentsNames[name][1]);
            value[name] |= (value[product2componentsNames[name][0]] & value[product2componentsNames[name][1]])
        }
    }

    Object.keys(product2componentsNames).forEach(tree);

    excludes.forEach(({ perk, color }) => value[perk] &= ~color);

    Object.entries(value).forEach(([key, val]) => myDiagram.findNodeForKey(node2name[key]).findPort("shape").stroke = numtocol(val));


    document.getElementById("flowers").innerHTML = ""
    let red = Math.ceil((1 + Math.sqrt(8 * req[6] + 1)) / 2);
    let green = Math.ceil((1 + Math.sqrt(8 * req[5] + 1)) / 2);
    let blue = Math.ceil((1 + Math.sqrt(8 * req[3] + 1)) / 2);

    //while(red * green < req[4]) green < red ? green++ : red++;
    //while(red * blue < req[2]) red < blue ? red++ : blue++;
    //while(blue * green < req[1]) blue < green ? blue++ : green++;

    Element.prototype.add = function (e) { this.append(e); return e; }
    const tr = document.createElement("tr");
    tr.add(document.createElement("td")).innerText = red;
    tr.add(document.createElement("td")).innerText = green;
    tr.add(document.createElement("td")).innerText = blue;
    document.getElementById("flowers").append(tr);
}


init();

document.getElementById("mySavedModel").value = window.localStorage.getItem("graph");
document.getElementById("sets").value = window.localStorage.getItem("sets");

load();
layout();
setsUpdate();
