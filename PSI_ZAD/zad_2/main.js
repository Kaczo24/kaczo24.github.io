let prev = document.getElementById("default");
let selectedTypeName = document.getElementById("selectedTypeName");
let listDiv = document.getElementById("list");
changeList("Windows");

function selectList(event) {
    prev.style.backgroundColor = "";
    event.currentTarget.style.backgroundColor = "orange";
    prev = event.currentTarget;
    let name = event.currentTarget.getAttribute("src").slice(7, -4);
    selectedTypeName.innerText = name;
    changeList(name);
}

function changeList(name) {
    listDiv.innerHTML = "";
    for(let el in data[name]) {
        let entry = document.createElement("div");

        let link = document.createElement("a");
        link.innerText = data[name][el].name;
        if(data[name][el].link)
            link.setAttribute("href", data[name][el].link);

        let index = document.createElement("p");
        index.innerText = `${parseInt(el) + 1}.`;

        entry.appendChild(index);
        entry.appendChild(link);
        listDiv.appendChild(entry);
    }
}