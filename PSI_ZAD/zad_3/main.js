//document.cookie.split("; ").find(x => x.startsWith("zad_3-settings")).substr(14);
//document.cookie = "zad_3-settings=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
let settingsCookie = "zad_3-settings";
let settings = {
    "BgColorHead": "#5A5A5A",
    "FontColorHead": "#c4c4cb",
    "BgColorText": "#ffffff",
    "FontColorText": "#000000"
};

document.body.onload = () => {
    try {
         settings = JSON.parse(document.cookie.split("; ").find(x => x.startsWith(settingsCookie)).substr(14));
    } catch (e) {
        return;
    }
    for(let x of document.getElementsByClassName("HEADER"))
        x.style.backgroundColor = settings.BgColorHead;
    for(let x of document.getElementsByClassName("HEADER"))
        x.style.color = settings.FontColorHead;
    document.body.style.backgroundColor = settings.BgColorText;
    document.body.style.color = settings.FontColorText;
}


function ChangeBgColorHead(event) {
    settings.BgColorHead = event.currentTarget.value;
    for(let x of document.getElementsByClassName("HEADER"))
        x.style.backgroundColor = settings.BgColorHead;
    document.cookie = settingsCookie + "=" + JSON.stringify(settings);
}

function ChangeFontColorHead(event) {
    settings.FontColorHead = event.currentTarget.value;
    for(let x of document.getElementsByClassName("HEADER"))
        x.style.color = settings.FontColorHead;
    document.cookie  = settingsCookie + "=" + JSON.stringify(settings);
}


function ChangeBgColorText(event) {
    settings.BgColorText = event.currentTarget.value;
    document.body.style.backgroundColor = settings.BgColorText;
    document.cookie  = settingsCookie + "=" + JSON.stringify(settings);
}

function ChangeFontColorText(event) {
    settings.FontColorText = event.currentTarget.value;
    document.body.style.color = settings.FontColorText;
    document.cookie  = settingsCookie + "=" + JSON.stringify(settings);
}