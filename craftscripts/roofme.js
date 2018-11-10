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


var curveThrottle = 10;
var curveRatio = 0.3;
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
var lwReverse = region.getLength() < region.getWidth()





//roof block
// var blocktype = context.getBlock(argv[1]); //the block for length
// var blocktype2 = context.getBlock(argv[2]); //the block for width
var blocktype = function(){
    if(lwReverse){
        return context.getBlock('53:3'); //the block for length
    }
    return context.getBlock('53:1'); //the block for length
}
var blocktype2 = function(){
    if (lwReverse){
        return context.getBlock('53:8'); //the block for width
    }
    return context.getBlock('53:2'); //the block for width
}

//down roof block
var blocktype3 = function(){
    if(lwReverse){
        return context.getBlock('136:4');
    }
    return context.getBlock('136:6');
}
var blocktype4 = function(){
    if(lwReverse){
        return context.getBlock('136:5');    
    }
    return context.getBlock('136:7');
}

var blockQtz = context.getBlock('155');
var blockQtzWin1 = function(){
    if (lwReverse){
        return context.getBlock('156:1');    
    }
    return context.getBlock('156:3');
}
var blockQtzWin2 = function(){
    if(lwReverse){
        return context.getBlock('156:2');
    }
    return context.getBlock('156:4');
}
var blockLight = context.getBlock('89');


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
                var vec = customVec((w + c), (l+c), layer);

                blocks.setBlock(vec, blocktype());
            }
            if (w == 0 || w == (realwidth - (c * 2)) - 1) {
                var vec = customVec((w + c), (l+c), layer);
                blocks.setBlock(vec, blocktype2());
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
                    var vec = customVec((w + c), (l+c), y)
                    blocks.setBlock(vec, blockQtzWin2());
                }
                if (w == 0 || w == (realwidth - (c * 2)) - 1) {
                    var vec = customVec((w + c), (l+c), y);
                    blocks.setBlock(vec, blockQtzWin1());
                   
                }

            }
        }
    }
}

function drawLight(w, l, y) {
    var vec = customVec(w ,l, y)    
    // var vec = new Vector(
    //     region.getMinimumPoint().getX() + width ,
    //     region.getMaximumPoint().getY() + y,
    //     region.getMinimumPoint().getZ() + len);
    blocks.setBlock(vec, blockLight);


}

function drawGround(y){
    for (var w = 0; w <= realwidth; w++){
        for(var l =0; l <= reallength; l++){

            // var vec = new Vector(
            //     region.getMinimumPoint().getX() + w,
            //     region.getMaximumPoint().getY() + y,
            //     region.getMinimumPoint().getZ() + l);
            var vec = customVec(w ,l, y)
            blocks.setBlock(vec, blockQtz);
        }
    }
}


function customVec(w ,l, y){
    if(lwReverse){
        var vec = new Vector(
            region.getMinimumPoint().getX() + l,
            region.getMaximumPoint().getY() + y,
            region.getMinimumPoint().getZ() + w);
        return vec
    }else{
        var vec = new Vector(
            region.getMinimumPoint().getX() + w,
            region.getMaximumPoint().getY() + y,
            region.getMinimumPoint().getZ() + l);
        return vec
    }
}