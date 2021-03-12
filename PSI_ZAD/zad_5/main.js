const images = document.getElementById("images");
const inputs = document.getElementById("inputs");
let settings = {};
Setup();

function Setup() {
    let current = [];
    for(let name in all) {
        let img = document.createElement("img");
        img.setAttribute("src", `images/${name}.jpg`);
        images.appendChild(img);
    }


    let template = {};
    for(let name in all) 
        for(let test in all[name]) {
            if(!template[test])
                template[test] = [];
            for(let val of all[name][test])
                if(!template[test].includes(val))
                    template[test].push(val);
        }
    let sel
    for(let test in template) {
        (sel = document.createElement("label")).innerText = test
        inputs.appendChild(sel);
        template[test].sort();
        sel = document.createElement("select");
        sel.setAttribute("id", test);
        sel.setAttribute("onchange", "UpdateValue(event);");

        let opt = document.createElement("option");
        opt.setAttribute("value", "unset");
        opt.innerText = "unset";
        sel.appendChild(opt);

        for(let val of template[test]) {
            opt = document.createElement("option");
            opt.setAttribute("value", val);
            opt.innerText = val;
            sel.appendChild(opt);
        }
        inputs.appendChild(sel);
        inputs.appendChild(document.createElement("br"));
    }


    for(let name in all) 
        for(let test in all[name]) 
            all[name][test].push(undefined);
}

function UpdateValue(event) {
    if(event.currentTarget.value == "unset")
        delete settings[event.currentTarget.id];
    else 
        settings[event.currentTarget.id] = event.currentTarget.value;
    UpdateAnswers();
}

function UpdateAnswers() {
    let current = [];
    for(let name in all) {
        let B = true;
        let v = 0;
        for(let test in all[name]) {
            if(!all[name][test].includes(settings[test])) {
                B = false;
                break;
            }
            v += (all[name][test].length - all[name][test].indexOf(settings[test])) / all[name][test].length;
        }
        if(B)
            current.push([name, v]);
    }
    images.innerHTML = "";
    current.sort((a, b) => b[1] - a[1]);
    for(let name of current) {
        let img = document.createElement("img");
        img.setAttribute("src", `images/${name[0]}.jpg`);
        images.appendChild(img);
    }
}