let cout = document.getElementById("cout");
let win;

function GetData() {
    let pos = "undefined";
    if(navigator.geolocation) navigator.geolocation.getCurrentPosition((position)=>{
        pos = `Latitude: ${position.coords.latitude}; Longitude: ${position.coords.longitude}`;
    });
    cout.innerText = 
    `Rozdzielczość: ${screen.width} x ${screen.height}, glebia: ${screen.colorDepth},
     UserAgent: ${navigator.userAgent},
     CookieEnabled: ${navigator.cookieEnabled}
     Language ${navigator.language}
     Position: ${pos}`;
}

function Open() {
    (win = window.open("", "win", "width=300,height=300")).document.write("<p>This is a window!</p>");
}

function Close() {
    if(win) win.close();
}

function Up() {
    win.moveBy(0, -20);
    win.focus();
}

function Down() {
    win.moveBy(0, 20);
    win.focus();
}

function Left() {
    win.moveBy(-20, 0);
    win.focus();
}

function Right() {
    win.moveBy(20, 0);
    win.focus();
}

function Center() {
    win.moveTo((screen.width - win.outerWidth) / 2, (screen.height - win.outerHeight) / 2);
    win.focus();
}