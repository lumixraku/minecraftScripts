var mylog = console.log
var constwidth = 12;
var constlength = 30;

var blocktype = 155; //the block for length
var blocktype2 = 155; //the block for width


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
var curveThrottle = 10;
var curveRatio = 1;
var realwidth = Math.min(region.getLength(), region.getWidth());
var reallength = Math.max(region.getLength(), region.getWidth());
//var height = parseInt(realwidth/1.5);


var useCurve = region.getWidth() > curveThrottle ? 1 :0;//此时使用缓坡屋顶
var curveValue = 2;
var layer = 0;
var cloop = 0;
var loops = parseInt(realwidth / 2);
//draw a flat floor and then move some blocks up step by step

var height = 0;
//draw outerblocks and then inner blocks by loops step by step
for (var c = 0; c < loops; c++) { //渲染边框次数  
   
   
    if(useCurve && c <= loops ){
        c%2 == 0 ? height++ : 0;
    }else{
        height++;
        
    }

    forRoof(height)

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