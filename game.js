// canvas setup
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// audio
var soundGlass = new Howl({src: ['audio/glass.wav']});
var soundGlassId;
var soundBreak = new Howl({src: ['audio/break.wav']});
document.addEventListener('keypress', (e) => soundPlaceholder.play());

// mouse/touch
var TOUCH_INTERVAL = 0.2;
var mousePos = {x: 0, y: 0};
var mouseDown = false;
document.addEventListener('mousedown', (e) => {
   mousePos = {x: e.clientX, y: e.clientY};
   mouseDown = true;
});
document.addEventListener('mousemove', (e) => {
   mousePos = {x: e.clientX, y: e.clientY};
});
document.addEventListener('mouseup', (e) => {
   mouseDown = false;
});

// update variables
var mouseDownTime = 0;
var currentSquare; // {id, x, y, radius, hue}
var squares = [];
var S = 100;
var L = 70;
var A = 0.6;

var text = document.querySelectorAll('.text')[0];

// update loop
var prevTime = performance.now();
var globalTime = 0;
function update() {
    var dt = (performance.now() - prevTime) / 1000;
    prevTime = performance.now();
    globalTime += dt;

    // mouse up/down 
    if (mouseDown) {
        mouseDownTime += dt;
        if (text) {
            text.remove();
            text = null;
        }
    } else {
        if (mouseDownTime > 0 && mouseDownTime <= TOUCH_INTERVAL) {
            // click
            var allClickedSquares = [];
            for (var i = 0; i < squares.length; i++) {
                var square = squares[i];
                if (mousePos.x >= (square.x - square.radius) 
                && mousePos.y >= (square.y - square.radius)
                && mousePos.x <= (square.x + square.radius)
                && mousePos.y <= (square.y + square.radius)) {
                    allClickedSquares.push(square);
                }
            }
            // reverse sort by id
            allClickedSquares = allClickedSquares.sort((a, b) => b.id - a.id);
            // delete square
            squares.splice(squares.indexOf(allClickedSquares[0]), 1);
            soundBreak.play();
        }
    }

    // holding
    if (mouseDownTime > TOUCH_INTERVAL) {
        if (!currentSquare) {
            currentSquare = {id: squares.length, x: 0, y: 0, radius: 0, hue: Math.random() * 360};
            squares.push(currentSquare);
            soundGlassId = soundGlass.play();
        }
        currentSquare.x = mousePos.x;
        currentSquare.y = mousePos.y;
        currentSquare.radius = Math.max(mouseDownTime - TOUCH_INTERVAL, 0.1) * 150;
    }

    // mouse up
    if (!mouseDown) {
        mouseDownTime = 0;
        currentSquare = null;
        soundGlass.stop(soundGlassId);
    }

    // canvas sizing
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvas.width = w;
    canvas.height = h;

    // clear canvas
    ctx.clearRect(0, 0, w, h);

    // rendering
    for (var i = 0; i < squares.length; i++) {
        var square = squares[i];
        ctx.fillStyle = 'hsla(' + square.hue + ', ' + S + '%, ' + L + '%, ' + A + ')';
        ctx.fillRect(square.x - square.radius, square.y - square.radius, square.radius * 2, square.radius * 2);
    }

    requestAnimationFrame(update);
}
requestAnimationFrame(update);