// DrawLine.js
//
function main() {
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    var ctx = canvas.getContext('2d');

    // draw 10 random lines
    for (let i = 0; i < 10; i++) {
        let x0 = Math.random() * canvas.width;
        let y0 = Math.random() * canvas.height;
        let x1 = Math.random() * canvas.width;
        let y1 = Math.random() * canvas.height;
        let r = Math.random() * 256;
        let g = Math.random() * 256;
        let b = Math.random() * 256;
        drawLine(x0, y0, x1, y1, ctx, { r, g, b });
    }

}

