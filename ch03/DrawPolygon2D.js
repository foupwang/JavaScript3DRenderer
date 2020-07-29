// DrawPolygon2D.js
//

// define points of asteroid
var vertices = [
    { x:33, y:-3 },
    { x:9, y:-18 },
    { x:-12, y:-9 }, 
    { x:-21, y:-12 },
    { x:-9, y:6 },
    { x:-15, y:15 },
    { x:-3, y:27 }, 
    { x:21, y:21 }
];

const NUM_ASTEROIDS = 16;
let asteroids = [];

function main() {
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    var ctx = canvas.getContext('2d');

    for (let curr_index = 0; curr_index < NUM_ASTEROIDS; curr_index++) {
        let obj = {};
        obj.state =  1;
        obj.num_verts = 8;
        obj.x0 = Math.random() * canvas.width;
        obj.y0 = Math.random() * canvas.height;
        obj.xv = -5 + Math.random() * 11;
        obj.yv = -5 + Math.random() * 11;

        let color = { r:0, g:0, b:0 };
        color.r = Math.random() * 256;
        color.g = Math.random() * 256;
        color.b = Math.random() * 256;
        obj.color = color;

        let vlist = [];
        for (let i = 0; i < obj.num_verts; i++) {
            let vert = {};
            vert.x = vertices[i].x;
            vert.y = vertices[i].y;
            vlist.push(vert);
        }
        obj.vlist = vlist;

        asteroids.push(obj);
    }

    var tick = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(ctx, canvas.width, canvas.height);
        requestAnimationFrame(tick);
    }

    tick();

}

function draw(ctx, maxWidth, maxHeight) {

    for (let curr_index = 0; curr_index < NUM_ASTEROIDS; curr_index++) {
        
        drawPolygon2D(asteroids[curr_index], ctx);

        // move the asteroid
        asteroids[curr_index].x0 += asteroids[curr_index].xv;        
        asteroids[curr_index].y0 += asteroids[curr_index].yv;           

        // test for out of bounds
        if (asteroids[curr_index].x0 > maxWidth+100)
            asteroids[curr_index].x0 = - 100;

        if (asteroids[curr_index].y0 > maxHeight+100)
            asteroids[curr_index].y0 = - 100;

        if (asteroids[curr_index].x0 < -100)
            asteroids[curr_index].x0 = maxWidth+100;

        if (asteroids[curr_index].y0 < -100)
            asteroids[curr_index].y0 = maxHeight+100;
    }
}

function drawPolygon2D(poly, ctx) {
    let ret = 0;
    if (poly.state) {
        let index = 0;
        for (index = 0; index < poly.num_verts-1; index++) {
            drawClipLine(poly.vlist[index].x + poly.x0,
                poly.vlist[index].y + poly.y0,
                poly.vlist[index+1].x + poly.x0,
                poly.vlist[index+1].y + poly.y0,
                ctx, poly.color);
        }

        drawClipLine(poly.vlist[0].x + poly.x0,
            poly.vlist[0].y + poly.y0,
            poly.vlist[index].x + poly.x0,
            poly.vlist[index].y + poly.y0,
            ctx, poly.color);
        ret = 1;
    }
    return ret;
}
