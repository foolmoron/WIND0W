// canvas setup
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// audio
var soundPlaceholder = new Howl({src: ['audio/placeholder.wav']});
document.addEventListener('keypress', (e) => soundPlaceholder.play());

// mouse/touch
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

// update loop
var prevTime = performance.now();
function update() {
    var dt = performance.now() - prevTime;

    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.3)';
    ctx.fillRect(0, 0, w, h);

    console.log(mouseDown, mousePos);

    requestAnimationFrame(update);
}
requestAnimationFrame(update);