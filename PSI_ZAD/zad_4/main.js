const angle = document.getElementById("angle");
const holes = document.getElementById("holes");
const miningDamage = document.getElementById("miningDamage");

const widthIN = document.getElementsByName("width")[0];
const heightIN = document.getElementsByName("height")[0];
const areaIN = document.getElementsByName("area")[0];
const WH = document.getElementById("WH");

const firstname = document.getElementsByName("firstname")[0];
const lastname = document.getElementsByName("lastname")[0];
const phonenumber = document.getElementsByName("phonenumber")[0];
const question = document.getElementsByName("question")[0];

const errorOut = document.getElementById("errorOut");
const charLength = document.getElementById("charLength");
let isAnimating = false;

AreaAct();
LngAct();

function ShowAngle(event) {
    angle.style.display = event.currentTarget.checked ? "block" : "none";
    angle.childNodes[3].disabled = !event.currentTarget.checked
}

function ShowHoles(event) {
    holes.style.display = event.currentTarget.checked ? "block" : "none";
    holes.childNodes[3].disabled = !event.currentTarget.checked
}

function ShowDamage(event) {
    miningDamage.style.display = event.currentTarget.checked ? "block" : "none";
    miningDamage.childNodes[3].disabled = !event.currentTarget.checked;
}

function AreaAct() {
    areaIN.value = widthIN.value * heightIN.value;
}
function LngAct() {
    charLength.innerText = `Obecnie ${question.value.length} znaków.`
}

function SetType(event) {
    if(event.currentTarget.value == "regular") {
        widthIN.disabled = false;
        heightIN.disabled = false;
        WH.style.display = "block";
        areaIN.disabled = true;
        AreaAct();
    } else {
        widthIN.disabled = true;
        heightIN.disabled = true;
        WH.style.display = "none";
        areaIN.disabled = false;
    }
}

function Validate(form) {
    if(firstname.value == "") {
        if(!isAnimating)
            Highlite(firstname, 255);
        errorOut.innerText = "Musisz podac imię";
        return false;
    }
    if(lastname.value == "") {
        if(!isAnimating)
            Highlite(lastname, 255);
        errorOut.innerText = "Musisz podac nazwisko";  
        return false;
    }
    if(phonenumber.value == "") {
        if(!isAnimating)
            Highlite(phonenumber, 255);
        errorOut.innerText = "Musisz podac numer telefonu";
        return false;
    }
    if(phonenumber.value.length < 9) {
        if(!isAnimating)
            Highlite(phonenumber, 255);
        errorOut.innerText = "Czy to na pewno numer telefonu?";
        return false;
    }
    if(question.value.length > 500) {
        if(!isAnimating)
            Highlite(question, 255);
        errorOut.innerText = "Zapytanie nie może być dłuższe niż 500 znaków";
        return false;
    }
    return true;
}

function Highlite(element, t) {
    isAnimating = true;
    element.style.backgroundColor = `rgb(255, ${255 - t}, ${255 - t})`;
    if(t == 0)  {
        isAnimating = false;
        return;
    }
    setTimeout(() => Highlite(element, t - 5), 60)
}