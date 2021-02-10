//document.cookie.split("; ").find(x => x.startsWith("zad_3-settings")).substr(14);
//document.cookie = "zad_3-settings=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
const settingsCookie = "zad_3-settings";
const TEXT = document.getElementById("TEXT");
let settings = {
    "BgColorHead": "#5A5A5A",
    "FontColorHead": "#c4c4cb",
    "BgColorText": "#ffffff",
    "FontColorText": "#000000",
    "FontSize": "100",
    "FontFamily": "Times New Roman"
};
const fonts = [
    "Times New Roman",
    "Georgia",
    "Palatino Linotype",
    "Book Antiqua",
    "Arial",
    "Helvetica",
    "Arial Black",
    "Impact",
    "Lucida Sans Unicode",
    "Tahoma",
    "Verdana",
    "Courier New",
    "Lucida Console"
];

function FillSelect() {
    let selFont = document.getElementById("FontFamily");
    for(let f of fonts) {
        let opt = document.createElement("option");
        opt.innerText = f;
        opt.setAttribute("value", f);
        selFont.appendChild(opt);
    }
    selFont.selectedIndex = fonts.findIndex(x => x == settings.FontFamily);
}

document.body.onload = () => {

    try {
         settings = JSON.parse(document.cookie.split("; ").find(x => x.startsWith(settingsCookie)).substr(15));
    } catch (e) {
        FillSelect();
        return;
    }
    FillSelect();
    for(let x of document.getElementsByClassName("HEADER"))
        x.style.backgroundColor = settings.BgColorHead;
    for(let x of document.getElementsByClassName("HEADER"))
        x.style.color = settings.FontColorHead;
    document.body.style.backgroundColor = settings.BgColorText;
    document.body.style.color = settings.FontColorText;
    TEXT.style.fontSize = settings.FontSize + "%";
    TEXT.style.fontFamily = settings.FontFamily;

    for(let n in settings) 
        document.getElementById(n).value = settings[n];
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

function ChangeFontSize(event) {
    settings.FontSize = event.currentTarget.value;
    TEXT.style.fontSize = settings.FontSize + "%";
    document.cookie  = settingsCookie + "=" + JSON.stringify(settings);
}

function ChangeFontFamily(event) {
    settings.FontFamily = event.target.value;
    TEXT.style.fontFamily = settings.FontFamily;
    document.cookie  = settingsCookie + "=" + JSON.stringify(settings);
}