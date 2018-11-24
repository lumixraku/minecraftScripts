// $Id$
/*
 * Copyright (c) 2011 Bentech
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

importPackage(Packages.java.io);
importPackage(Packages.java.awt);
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);
java.lang.System.out.println("1232313122312321321313") //you can check print message in minecraft log

var curveThrottle = 10;
var curveRatio = 0.5;
var wallshrink = 5;
var wallheight = 5;
var lightStep = 5;

var blocks = context.remember();
var session = context.getSession();
var region = session.getRegion();
// context.checkArgs(1, 1, "<type>");
// context.checkArgs(1, 2, "<type> <type>");

var realwidth = Math.min(region.getLength(), region.getWidth());
var reallength = Math.max(region.getLength(), region.getWidth());
var lwReverse = region.getLength() < region.getWidth()  //lwReverse True东西方向作为长度


var MinX = region.getMinimumPoint().getX();
var MaxY = region.getMaximumPoint().getY();
var MinZ = region.getMinimumPoint().getZ();



//roof block
// var blocktype = context.getBlock(argv[1]); //the block for length
// var blocktype2 = context.getBlock(argv[2]); //the block for width
var blocktype = function () {
    if (lwReverse) {
        return context.getBlock('164:3'); //the block for length
    }
    return context.getBlock('164:1'); //the block for length
}
var blocktype2 = function () {
    if (lwReverse) {
        return context.getBlock('164:8'); //the block for width
    }
    return context.getBlock('164:2'); //the block for width
}

//down roof block
var blocktype3 = function () {
    if (lwReverse) {
        return context.getBlock('136:6');
    }
    return context.getBlock('136:5');
}
var blocktype4 = function () {
    if (lwReverse) {
        return context.getBlock('136:4');
    }
    return context.getBlock('136:7');
}

var blockQtz = context.getBlock('155');
var blockQtzWin1 = function () {
    if (lwReverse) {
        return context.getBlock('156:1');
    }
    return context.getBlock('156:3');
}
var blockQtzWin2 = function () {
    if (lwReverse) {
        return context.getBlock('156:2');
    }
    return context.getBlock('156:4');
}
var blockLight = context.getBlock('89');
var blockWood = context.getBlock('5:5');


// var blocktype = context.getBlock('53:1'); //
// var blocktype2 = context.getBlock('53:2');  //另一个朝向的楼梯


var loops = realwidth / 2;  // cycles = cycles / 2; //长度的一半
var useCurve = region.getWidth() > curveThrottle ? 1 : 0;//此时使用缓坡屋顶
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

// drawWall(roofLowY * -1, parseInt(loops * curveRatio))
drawWall(roofLowY * -1, wallshrink)
drawGround((roofLowY + wallheight) * -1)


function drawRoof(layer, c) {

    for (var w = 0; w < realwidth - (c * 2); w++) { //屋顶某一层的宽  //每一层宽度都比下面一层少两个(缓坡屋顶少4个)
        for (var l = 0; l < reallength - (c * 2); l++) {  //屋顶某一层长

            if (
                (l < (reallength - (c * 2)) - 1) && (w < (realwidth - (c * 2)) - 1)
            ) {
                if (Math.random() * lightStep * 10 < 1) {
                    drawLight(w + c, l + c, layer)
                }

            }
            if (l == 0 || l == (reallength - (c * 2)) - 1) {
                var vec = customVec((w + c), (l + c), layer);
                if(layer < 0) {
                    //down roof
                    blocks.setBlock(vec, blocktype3());

                }else{
                    blocks.setBlock(vec, blocktype());
                }

            }
            if (w == 0 || w == (realwidth - (c * 2)) - 1) {
                var vec = customVec((w + c), (l + c), layer);
                if(layer < 0) {
                    //down roof
                    blocks.setBlock(vec, blocktype4());

                }else{
                    blocks.setBlock(vec, blocktype2());
                }
            }
        }
    }

}


// y should < 0
function drawWall(yOrigin, c) {
    var y = yOrigin;

    for (var i = 0; i < wallheight; i++) {
        y = yOrigin - i;
        // drawOneLayerBorder(y, reallength, realwidth, function(vec){
        //     blocks.setBlock(vec, blockQtzWin2());
        // }, function(vec){
        //     blocks.setBlock(vec, blockQtzWin1());
        // })
        for (var w = c; w < realwidth - c; w++) { //屋顶某一层的宽  //每一层宽度都比下面一层少两个(缓坡屋顶少4个)
            for (var l = c; l < reallength - c; l++) {  //屋顶某一层长

                if (l == c || l == (reallength - c) - 1) {
                    var vec = customVec(w, l, y)
                    blocks.setBlock(vec, blockQtzWin2());
                }
                if (w == c || w == (realwidth - c) - 1) {
                    var vec = customVec(w, l, y)
                    blocks.setBlock(vec, blockQtzWin1());

                }

            }
        }
    }


    y = yOrigin - 1;
    for (w = c; w < realwidth - c; w++) { //屋顶某一层的宽  //每一层宽度都比下面一层少两个(缓坡屋顶少4个)
        for (l = c; l < reallength - c; l++) {  //屋顶某一层长
            if (l == c || l == (reallength - c) - 1) {
                var vec = customVec(w, l, y)
                blocks.setBlock(vec, blockWood);
            }
            if (w == c || w == (realwidth - c) - 1) {
                var vec = customVec(w, l, y);
                blocks.setBlock(vec, blockWood);

            }

        }
    }



    var widthHead = c;
    var widthTail = realwidth - c -1;
    var lengthHead = c;
    var lengthTail = reallength - c -1;
    var ymax = yOrigin - wallheight;

    // var vec = customVec(1 , 1, y)
    // blocks.setBlock(vec, blockWood);  
    var time = 0
    while (lengthHead < lengthTail) {
        // var vec = customVec(2 , 2, y)
        // blocks.setBlock(vec, blockWood);    
        if (time % wallheight == 0) {
            for (y = yOrigin; y > ymax ; y--) {
                var vec = customVec(widthHead, lengthHead, y)
                blocks.setBlock(vec, blockWood);
                vec = customVec(widthHead, lengthTail, y)
                blocks.setBlock(vec, blockWood);
                vec = customVec(widthTail, lengthHead, y)
                blocks.setBlock(vec, blockWood);
                vec = customVec(widthTail, lengthTail, y)
                blocks.setBlock(vec, blockWood);                
            }
        }
        time++;
        lengthHead++;
        lengthTail--;
    }
    //宽面中间的木头
    widthHead = c;
    widthTail = realwidth - c -1;
    lengthHead = c;
    lengthTail = reallength - c -1;
    for (y = yOrigin; y > ymax ; y--) {
        var vec = customVec(widthHead + (widthTail-widthHead)/2, lengthTail, y)
        blocks.setBlock(vec, blockWood);  
        vec = customVec(widthHead + (widthTail-widthHead)/2, lengthHead, y)
        blocks.setBlock(vec, blockWood);       
        java.lang.System.out.println("Y:::" + y)    
    }
}

function drawLight(w, l, y) {
    var vec = customVec(w, l, y)
    blocks.setBlock(vec, blockLight);


}

function drawGround(y) {
    for (var w = 0; w <= realwidth; w++) {
        for (var l = 0; l <= reallength; l++) {


            var vec = customVec(w, l, y)
            blocks.setBlock(vec, blockQtz);
        }
    }
}


function customVec(w, l, y) {
    if (lwReverse) {
        var vec = new Vector(
            MinX + l,
            MaxY + y,
            MinZ + w);
        return vec
    } else {
        var vec = new Vector(
            MinX + w,
            MaxY + y,
            MinZ + l);
        return vec
    }
}


// function drawOneLayerBorder(h, start , end, cb1, cb2){
//     var w, l;
//     for (w = start; w < end - c ; w++) { //屋顶某一层的宽  //每一层宽度都比下面一层少两个(缓坡屋顶少4个)
//         for (l = start; l < end - c; l++) {  //屋顶某一层长
//             if (l == start || l == end - 1) {
//                 var vec = customVec(w , l, h)
//                 cb1(vec)
//                 // blocks.setBlock(vec, blockWood);
//             }
//             if (w ==  || w == (realwidth - c) - 1) {
//                 var vec = customVec(w , l, h);
//                 cb2(vec)
//                 // blocks.setBlock(vec, blockWood);

//             }

//         }
//     }

// }