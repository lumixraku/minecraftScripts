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


var blocks = context.remember();
var session = context.getSession();
var region = session.getRegion();

// context.checkArgs(1, 1, "<type>");
context.checkArgs(1, 2, "<type> <type>");

//roof block
var blocktype = context.getBlock(argv[1]); //the block for length
var blocktype2 = context.getBlock(argv[2]); //the block for width
//down roof block
var blocktype3 = context.getBlock('53:1');
var blocktype3 = context.getBlock('53:1');

// var blocktype = context.getBlock('53:1'); //
// var blocktype2 = context.getBlock('53:2');  //另一个朝向的楼梯

var realwidth = Math.min(region.getLength(), region.getWidth());
var reallength = Math.max(region.getLength(), region.getWidth());


var loops = realwidth/2;  // cycles = cycles / 2; //长度的一半
var useCurve = region.getWidth() > curveThrottle ? 1 :0;//此时使用缓坡屋顶
var curveValue = 2;
var height = 0;


//draw outerblocks and then inner blocks by loops step by step
for (var c = 0; c < loops; c++) { //渲染边框次数  
   
    if(useCurve && c <= loops * curveRatio ){
        c%2 == 0 ? height++ : 0;
    }else{
        height++;
    }

    forRoof(height)
    if ( c > 0  && c < 5){
        forRoof( (height -1 ) * -1)
    }
}


function forRoof(layer){
    
    for (var w = 0; w < realwidth - (c * 2); w++) { //屋顶某一层的宽  //每一层宽度都比下面一层少两个(缓坡屋顶少4个)
        for (var l = 0; l < reallength - (c * 2); l++) {  //屋顶某一层长
            
            
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

            //useCurve
            // if(curveValue !=2 ){
            //     if (l == 1 || l == (reallength - (c * curveValue)) - 2) {
            //         var vec = new Vector(
            //             region.getMinimumPoint().getX() + (w + c),
            //             region.getMaximumPoint().getY() + c,  //
            //             region.getMinimumPoint().getZ() + (l + c));
                    
            //         blocks.setBlock(vec, blocktype);
            //     }
            //     if (w == 1 || w == (realwidth - (c * curveValue)) - 2) {    
            //         var vec = new Vector(
            //             region.getMinimumPoint().getX() + (w + c),
            //             region.getMaximumPoint().getY() + c,  //
            //             region.getMinimumPoint().getZ() + (l + c));                        
            //         blocks.setBlock(vec, blocktype2);                
            //     }                
            // }
        }
    }

}

function forDownRoof(){

}
