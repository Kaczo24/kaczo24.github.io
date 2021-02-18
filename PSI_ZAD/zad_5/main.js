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
    
    for(let test in template) {
        template[test].sort();
        let sel = document.createElement("select");
        sel.setAttribute("id", test);
        sel.setAttribute("onchange", "UpdateValue(event);");
        for(let val of template[test]) {
            let opt = document.createElement("option");
            opt.setAttribute();
            sel.appendChild(opt);
        }
        inputs.appendChild(sel);
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
        for(let test in all[name]) 
            if(!all[name][test].includes(settings[test])) {
                B = false;
                break;
            }
        if(B)
            current.push(name);
    }
    images.innerHTML = "";
    for(let name of current) {
        let img = document.createElement("img");
        img.setAttribute("src", `images/${name}.jpg`);
        images.appendChild(img);
    }
}