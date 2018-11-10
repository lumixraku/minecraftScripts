var mylog = console.log
var constwidth = 12;
var constlength = 30;


var curveThrottle = 10;
var curveRatio = 0.3;
var wallshrink = 5;
var wallheight = 5;
var lightStep = 5;

var blocktype = 155; //the block for length
var blocktype2 = 155; //the block for width
var blocktype3 = 155;
var blocktype4 = 155;

var blockQtz = 155;
var blockQtzWin1 = 156;
var blockQtzWin2 = 156;
var blockLight = 89;



class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    getX() {
        return this.x
    }

    getY() {
        return this.y
    }

    getZ() {
        return this.z
    }    

}

var region = {
    getLength: function () {
        return constlength
    },

    getWidth: function () {
        return constwidth
    },
    getMinimumPoint() {
        return new Vector(0,0,0)
    },
    getMaximumPoint(){
        return new Vector(0,0,0)
    }    
}

var blocks = {
    setBlock: function (vec, type) {
        mylog(vec.x, vec.z, vec.y, type)
    }

}

var realwidth = Math.min(region.getLength(), region.getWidth());
var reallength = Math.max(region.getLength(), region.getWidth());


var loops = realwidth/2;  // cycles = cycles / 2; //长度的一半
var useCurve = region.getWidth() > curveThrottle ? 1 :0;//此时使用缓坡屋顶
var curveValue = 2;
var height = 0;
var roofLowY = 0;

//draw outerblocks and then inner blocks by loops step by step
for (var c = 0; c < loops; c++) { //渲染边框次数  

    if (useCurve && c <= parseInt(loops * curveRatio)) {
        c % 2 == 0 ? height++ : 0;
    } else {
        height++;
    }

    drawRoof(height, c)
    if (c > 0 && c < wallshrink) {
        roofLowY = height;
        drawRoof((height - 1) * -1, c)
    }
}
drawWall(roofLowY * -1, parseInt(loops * curveRatio))
drawGround((roofLowY + wallheight) * -1)


function drawRoof(layer, c) {

    for (var w = 0; w < realwidth - (c * 2); w++) { //屋顶某一层的宽  //每一层宽度都比下面一层少两个(缓坡屋顶少4个)
        for (var l = 0; l < reallength - (c * 2); l++) {  //屋顶某一层长

            if (
                (l < (reallength - (c * 2)) - 1) && (w < (realwidth - (c * 2)) - 1)
            ) {
                if (Math.random() * lightStep * 10 < 1) {
                    drawLight(w+c, l+c, layer)
                }

            }
            if (l == 0 || l == (reallength - (c * 2)) - 1) {
                var vec = new Vector(
                    region.getMinimumPoint().getX() + (w + c),
                    region.getMaximumPoint().getY() + layer,
                    region.getMinimumPoint().getZ() + (l + c));

                blocks.setBlock(vec, blocktype);
            }
            if (w == 0 || w == (realwidth - (c * 2)) - 1) {
                var vec = new Vector(
                    region.getMinimumPoint().getX() + (w + c),
                    region.getMaximumPoint().getY() + layer,  //
                    region.getMinimumPoint().getZ() + (l + c));
                blocks.setBlock(vec, blocktype2);
            }
        }
    }

}


// y should < 0
function drawWall(yOrigin, c) {
    var y = yOrigin;

    for (var i = 0; i < wallheight; i++) {
        y = yOrigin - i;
        for (var w = 0; w < realwidth - (c * 2); w++) { //屋顶某一层的宽  //每一层宽度都比下面一层少两个(缓坡屋顶少4个)
            for (var l = 0; l < reallength - (c * 2); l++) {  //屋顶某一层长


                if (l == 0 || l == (reallength - (c * 2)) - 1) {
                    var vec = new Vector(
                        region.getMinimumPoint().getX() + (w + c),
                        region.getMaximumPoint().getY() + y,
                        region.getMinimumPoint().getZ() + (l + c));

                    blocks.setBlock(vec, blockQtzWin2);
                }
                if (w == 0 || w == (realwidth - (c * 2)) - 1) {
                    var vec = new Vector(
                        region.getMinimumPoint().getX() + (w + c),
                        region.getMaximumPoint().getY() + y,  //
                        region.getMinimumPoint().getZ() + (l + c));
                    blocks.setBlock(vec, blockQtzWin1);
                }

            }
        }
    }
}

function drawLight(width, len, y) {
    var vec = new Vector(
        region.getMinimumPoint().getX() + width ,
        region.getMaximumPoint().getY() + y,
        region.getMinimumPoint().getZ() + len);
    blocks.setBlock(vec, blockLight);


}

function drawGround(y){
    var vec = new Vector(
        region.getMinimumPoint().getX() + realwidth,
        region.getMaximumPoint().getY() + y,
        region.getMinimumPoint().getZ() + reallength);
    blocks.setBlock(vec, blockQtz);
}