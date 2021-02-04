//document.cookie.split("; ").find(x => x.startsWith("zad_3-settings")).substr(14);
//document.cookie = "zad_3-settings=; expires=Thu, 01 Jan 1970 00:00:00 UTC";

let settings = {
    "BgColorHead": "#5A5A5A",
    "FontColorHead": "#c4c4cb",
    "BgColorText": "#ffffff",
    "FontColorText": "#000000"
};



function ChangeBgColorHead(event) {
    for(let x of document.getElementsByClassName("HEADER"))
        x.style.backgroundColor = event.currentTarget.value;
    settings.BgColorHead = event.currentTarget.value;
    document.cookie = "zad_3-settings=" + JSON.stringify(settings);
}

function ChangeFontColorHead(event) {
    for(let x of document.getElementsByClassName("HEADER"))
        x.style.color = event.currentTarget.value;
    settings.FontColorHead = event.currentTarget.value;
    document.cookie  = "zad_3-settings=" + JSON.stringify(settings);
}


function ChangeBgColorText(event) {
    document.body.style.backgroundColor = event.currentTarget.value;
    settings.BgColorText = event.currentTarget.value;
    document.cookie  = "zad_3-settings=" + JSON.stringify(settings);
}

function ChangeFontColorText(event) {
    document.body.style.color = event.currentTarget.value;
    settings.FontColorText = event.currentTarget.value;
    document.cookie  = "zad_3-settings=" + JSON.stringify(settings);
}