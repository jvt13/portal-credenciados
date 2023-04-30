var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

ctx.strokeStyle = "black";
ctx.lineWidth = 2;

var isDrawing = false;
var lastX = 0;
var lastY = 0;

function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mousemove", draw);

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

canvas.addEventListener("mouseout", () => {
    isDrawing = false;
});

canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    lastX = e.touches[0].clientX - canvas.offsetLeft;
    lastY = e.touches[0].clientY - canvas.offsetTop;
    //alert("Fim")
});


canvas.addEventListener('touchmove', (e) => {
    //alert("Touc")
    if (isDrawing) {
        const currentX = e.touches[0].clientX - canvas.offsetLeft;
        const currentY = e.touches[0].clientY - canvas.offsetTop;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        lastX = currentX;
        lastY = currentY;

        // Use requestAnimationFrame para controlar a frequência de atualização
        requestAnimationFrame(() => {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();

            lastX = currentX;
            lastY = currentY;
        });
    }
});

canvas.addEventListener('touchend', () => {
    isDrawing = false;
});


var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
var modal_header = document.getElementById('modal-header');

window.addEventListener("orientationchange", function () {
    if (isMobile) {

        if (Math.abs(window.orientation) === 90) {//modo paisagem
            modal_header.style.marginTop = '0';
            var rec = (window.innerHeight * 5) / 100;
            var calc = (window.innerHeight * 5) / 100;
            canvas.style.left = calc + "px";
            canvas.width = window.innerHeight - (calc / 2);
            var calc = (window.screen.width * 38) / 100;
            canvas.height = window.screen.width - (calc * 2);
        } else if (window.orientation === 0) {//modo retrato
            modal_header.style.marginTop = '30%';
            var calc = (window.screen.width * 5) / 100;
            canvas.style.left = calc + "px";
            canvas.width = window.screen.width - (calc * 2);
            canvas.height = 150;
        }
    }
});

window.onload = function () {
    if (isMobile) {//Verifica se é dispositivo celular ou tablet.
        var calc = (window.screen.width * 5) / 100;
        canvas.style.left = calc + "px";
        canvas.width = window.screen.width - (calc * 2);

        if (window.orientation === undefined) {

        } else if (Math.abs(window.orientation) === 90) {//modo paisagem
            modal_header.style.marginTop = '0';
            var calc = (window.screen.width * 5) / 100;
            canvas.style.left = calc + "px";
            canvas.width = window.screen.width - (calc * 2) - 50;
            var calc = (window.screen.width * 38) / 100;
            canvas.height = window.screen.width - (calc * 2);
        } else if (window.orientation === 0) {//modo retrato
            alert("Para facilidar na assinatura, ative a rotação da tela e vire o dispositivo na horizontal.")
            modal_header.style.marginTop = '30%';
        }
    } else {
        modal_header.style.marginTop = '0';
        var calc = (window.screen.width * 5) / 100;
        canvas.style.left = calc + "px";
        canvas.width = window.screen.width;

    }
}
var mediaQuery = window.matchMedia("(max-width: 1000px)");

if (mediaQuery.matches) {
    //alert("fdsfs")
    //canvas.width = window.screen.width - 100;
    //canvas.height = 150;
}

mediaQuery = window.matchMedia("(max-width: 3000px)");

if (mediaQuery.matches) {
    //alert("fdsfs")
    canvas.width = window.screen.width - 100;
    /*canvas.width = 600;
    canvas.height = 150;*/
}