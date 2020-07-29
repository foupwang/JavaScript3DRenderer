// DrawPoint.js
//
function main() {
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    var ctx = canvas.getContext('2d');

    drawPixel(50, 150, ctx, {r:255,g:0,b:0});
    drawPixel(55, 150, ctx, {r:255,g:0,b:0});
    drawPixel(60, 150, ctx, {r:255,g:0,b:0});
    drawPixel(65, 150, ctx, {r:255,g:0,b:0});
    drawPoint(150, 150, 10, 10, ctx, {r:255,g:0,b:0});
    drawPoint(250, 150, 20, 20, ctx, {r:0,g:255,b:0});
    drawPoint(350, 150, 40, 40, ctx, {r:0,g:64,b:255});
}

