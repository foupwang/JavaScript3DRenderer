// default screen size
const SCREEN_WIDTH = 640;  // size of screen
const SCREEN_HEIGHT = 480;

function drawClipLine(x0, y0, x1, y1, ctx, color) {
    
    let result = clipLine(x0, y0, x1, y1);
    if (result.status) {
        drawLine(result.x1, result.y1, result.x2, result.y2, ctx, color);
    }

    return 1;
}

// global clipping region

let min_clip_x = 0,      // clipping rectangle 
    max_clip_x = SCREEN_WIDTH - 1,
    min_clip_y = 0,
    max_clip_y = SCREEN_HEIGHT - 1;

function clipLine(x1, y1, x2, y2) {
    // internal clipping codes
    const CLIP_CODE_C = 0x0000;
    const CLIP_CODE_N = 0x0008;
    const CLIP_CODE_S = 0x0004;
    const CLIP_CODE_E = 0x0002;
    const CLIP_CODE_W = 0x0001;

    const CLIP_CODE_NE = 0x000a;
    const CLIP_CODE_SE = 0x0006;
    const CLIP_CODE_NW = 0x0009;
    const CLIP_CODE_SW = 0x0005;

    let result = { status:0, x1:x1, y1:y1, x2:x2, y2:y2 };

    let xc1 = x1, yc1 = y1, xc2 = x2, yc2 = y2;
    let p1_code = 0, p2_code = 0; 

    // determine codes for p1 and p2
    if (y1 < min_clip_y)
        p1_code |= CLIP_CODE_N;
    else
        if (y1 > max_clip_y)
            p1_code |= CLIP_CODE_S;

    if (x1 < min_clip_x)
        p1_code |= CLIP_CODE_W;
    else
        if (x1 > max_clip_x)
            p1_code |= CLIP_CODE_E;

    if (y2 < min_clip_y)
        p2_code |= CLIP_CODE_N;
    else
        if (y2 > max_clip_y)
            p2_code |= CLIP_CODE_S;

    if (x2 < min_clip_x)
        p2_code |= CLIP_CODE_W;
    else
        if (x2 > max_clip_x)
            p2_code |= CLIP_CODE_E;

    // try and trivially reject
    if ((p1_code & p2_code)) {
        result.status = 0;
        return result;
    }

    // test for totally visible, if so leave points untouched
    if (p1_code == 0 && p2_code == 0) {
        result.status = 1;
        return result;
    }

    // determine end clip point for p1
    switch (p1_code) {
        case CLIP_CODE_C: break;

        case CLIP_CODE_N:
            {
                yc1 = min_clip_y;
                xc1 = x1 + 0.5 + (min_clip_y - y1) * (x2 - x1) / (y2 - y1);
            } break;
        case CLIP_CODE_S:
            {
                yc1 = max_clip_y;
                xc1 = x1 + 0.5 + (max_clip_y - y1) * (x2 - x1) / (y2 - y1);
            } break;

        case CLIP_CODE_W:
            {
                xc1 = min_clip_x;
                yc1 = y1 + 0.5 + (min_clip_x - x1) * (y2 - y1) / (x2 - x1);
            } break;

        case CLIP_CODE_E:
            {
                xc1 = max_clip_x;
                yc1 = y1 + 0.5 + (max_clip_x - x1) * (y2 - y1) / (x2 - x1);
            } break;

        // these cases are more complex, must compute 2 intersections
        case CLIP_CODE_NE:
            {
                // north hline intersection
                yc1 = min_clip_y;
                xc1 = x1 + 0.5 + (min_clip_y - y1) * (x2 - x1) / (y2 - y1);

                // test if intersection is valid, of so then done, else compute next
                if (xc1 < min_clip_x || xc1 > max_clip_x) {
                    // east vline intersection
                    xc1 = max_clip_x;
                    yc1 = y1 + 0.5 + (max_clip_x - x1) * (y2 - y1) / (x2 - x1);
                } // end if

            } break;

        case CLIP_CODE_SE:
            {
                // south hline intersection
                yc1 = max_clip_y;
                xc1 = x1 + 0.5 + (max_clip_y - y1) * (x2 - x1) / (y2 - y1);

                // test if intersection is valid, of so then done, else compute next
                if (xc1 < min_clip_x || xc1 > max_clip_x) {
                    // east vline intersection
                    xc1 = max_clip_x;
                    yc1 = y1 + 0.5 + (max_clip_x - x1) * (y2 - y1) / (x2 - x1);
                } // end if

            } break;

        case CLIP_CODE_NW:
            {
                // north hline intersection
                yc1 = min_clip_y;
                xc1 = x1 + 0.5 + (min_clip_y - y1) * (x2 - x1) / (y2 - y1);

                // test if intersection is valid, of so then done, else compute next
                if (xc1 < min_clip_x || xc1 > max_clip_x) {
                    xc1 = min_clip_x;
                    yc1 = y1 + 0.5 + (min_clip_x - x1) * (y2 - y1) / (x2 - x1);
                } // end if

            } break;

        case CLIP_CODE_SW:
            {
                // south hline intersection
                yc1 = max_clip_y;
                xc1 = x1 + 0.5 + (max_clip_y - y1) * (x2 - x1) / (y2 - y1);

                // test if intersection is valid, of so then done, else compute next
                if (xc1 < min_clip_x || xc1 > max_clip_x) {
                    xc1 = min_clip_x;
                    yc1 = y1 + 0.5 + (min_clip_x - x1) * (y2 - y1) / (x2 - x1);
                } // end if

            } break;

        default: break;

    } // end switch

    // determine clip point for p2
    switch (p2_code) {
        case CLIP_CODE_C: break;

        case CLIP_CODE_N:
            {
                yc2 = min_clip_y;
                xc2 = x2 + (min_clip_y - y2) * (x1 - x2) / (y1 - y2);
            } break;

        case CLIP_CODE_S:
            {
                yc2 = max_clip_y;
                xc2 = x2 + (max_clip_y - y2) * (x1 - x2) / (y1 - y2);
            } break;

        case CLIP_CODE_W:
            {
                xc2 = min_clip_x;
                yc2 = y2 + (min_clip_x - x2) * (y1 - y2) / (x1 - x2);
            } break;

        case CLIP_CODE_E:
            {
                xc2 = max_clip_x;
                yc2 = y2 + (max_clip_x - x2) * (y1 - y2) / (x1 - x2);
            } break;

        // these cases are more complex, must compute 2 intersections
        case CLIP_CODE_NE:
            {
                // north hline intersection
                yc2 = min_clip_y;
                xc2 = x2 + 0.5 + (min_clip_y - y2) * (x1 - x2) / (y1 - y2);

                // test if intersection is valid, of so then done, else compute next
                if (xc2 < min_clip_x || xc2 > max_clip_x) {
                    // east vline intersection
                    xc2 = max_clip_x;
                    yc2 = y2 + 0.5 + (max_clip_x - x2) * (y1 - y2) / (x1 - x2);
                } // end if

            } break;

        case CLIP_CODE_SE:
            {
                // south hline intersection
                yc2 = max_clip_y;
                xc2 = x2 + 0.5 + (max_clip_y - y2) * (x1 - x2) / (y1 - y2);

                // test if intersection is valid, of so then done, else compute next
                if (xc2 < min_clip_x || xc2 > max_clip_x) {
                    // east vline intersection
                    xc2 = max_clip_x;
                    yc2 = y2 + 0.5 + (max_clip_x - x2) * (y1 - y2) / (x1 - x2);
                } // end if

            } break;

        case CLIP_CODE_NW:
            {
                // north hline intersection
                yc2 = min_clip_y;
                xc2 = x2 + 0.5 + (min_clip_y - y2) * (x1 - x2) / (y1 - y2);

                // test if intersection is valid, of so then done, else compute next
                if (xc2 < min_clip_x || xc2 > max_clip_x) {
                    xc2 = min_clip_x;
                    yc2 = y2 + 0.5 + (min_clip_x - x2) * (y1 - y2) / (x1 - x2);
                } // end if

            } break;

        case CLIP_CODE_SW:
            {
                // south hline intersection
                yc2 = max_clip_y;
                xc2 = x2 + 0.5 + (max_clip_y - y2) * (x1 - x2) / (y1 - y2);

                // test if intersection is valid, of so then done, else compute next
                if (xc2 < min_clip_x || xc2 > max_clip_x) {
                    xc2 = min_clip_x;
                    yc2 = y2 + 0.5 + (min_clip_x - x2) * (y1 - y2) / (x1 - x2);
                } // end if

            } break;

        default: break;

    } // end switch

    // do bounds check
    if ((xc1 < min_clip_x) || (xc1 > max_clip_x) ||
        (yc1 < min_clip_y) || (yc1 > max_clip_y) ||
        (xc2 < min_clip_x) || (xc2 > max_clip_x) ||
        (yc2 < min_clip_y) || (yc2 > max_clip_y)) {
        result.status = 0;
        return result;
    } // end if

    // store vars back
    result.status = 1;
    result.x1 = xc1;
    result.y1 = yc1;
    result.x2 = xc2;
    result.y2 = yc2;

    return result;
}

function drawLine(x0, y0, x1, y1, ctx, color) {
    // this function draws a line from xo,yo to x1,y1 using differential error
    // terms (based on Bresenahams work)

    let dx,             // difference in x's
        dy,             // difference in y's
        dx2,            // dx,dy * 2
        dy2,
        x_inc,          // amount in pixel space to move during drawing
        y_inc,          // amount in pixel space to move during drawing
        error,          // the discriminant i.e. error i.e. decision variable
        index;          // used for looping

    // compute horizontal and vertical deltas
    dx = x1 - x0;
    dy = y1 - y0;

    // test which direction the line is going in i.e. slope angle
    if (dx >= 0) {
        x_inc = 1;
    } // end if line is moving right
    else {
        x_inc = -1;
        dx = -dx;  // need absolute value
    } // end else moving left

    // test y component of slope
    if (dy >= 0) {
        y_inc = 1;
    } // end if line is moving down
    else {
        y_inc = -1;
        dy = -dy;  // need absolute value
    } // end else moving up

    // compute (dx,dy) * 2
    dx2 = dx << 1;
    dy2 = dy << 1;

    // now based on which delta is greater we can draw the line
    if (dx > dy) {
        // initialize error term
        error = dy2 - dx;
        // draw the line
        for (index = 0; index <= dx; index++) {
            // set the pixel
            drawPixel(x0, y0, ctx, color);

            // test if error has overflowed
            if (error >= 0) {
                error -= dx2;

                // move to next line
                y0 += y_inc;

            } // end if error overflowed

            // adjust the error term
            error += dy2;

            // move to the next pixel
            x0 += x_inc;

        } // end for

    } // end if |slope| <= 1
    else {
        // initialize error term
        error = dx2 - dy;

        // draw the line
        for (index = 0; index <= dy; index++) {
            // set the pixel
            drawPixel(x0, y0, ctx, color);

            // test if error overflowed
            if (error >= 0) {
                error -= dy2;

                // move to next line
                x0 += x_inc;

            } // end if error overflowed

            // adjust the error term
            error += dx2;

            // move to the next pixel
            y0 += y_inc;

        } // end for

    } // end else |slope| > 1

    // return success
    return (1);
}

function drawPixel(x, y, ctx, color) {
    drawPoint(x, y, 1, 1, ctx, color);
}

function drawPoint(x, y, sx, sy, ctx, color) {
    let r = Math.floor(color.r) % 256;
    let g = Math.floor(color.g) % 256;
    let b = Math.floor(color.b) % 256;
    ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',1.0)';
    // ctx.fillStyle = 'rgba(255, 128, 0, 1.0)';
    ctx.fillRect(x, y, sx, sy);
}