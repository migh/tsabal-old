'use strict';
var protectedModel;
var i,j; // Dummy variables for loops
// Later include it into model
var superStruct;
var idCounter=0;

/**
 * Helper warning function
 * @param {String} message - Text to display
 * @param {Number} state - Conditional variable
 */
function warning(message,state){
    if (state)
        console.log(message);
}

/**
 * Node constructor
 * @constructor
 * @param {Number} x - Point's x coordinate
 * @param {Number} y - Point's y coordinate
 * @param {Number} z - Point's z coordinate
 */
function Node(x,y,z){
    this.id = ++idCounter;
    this.x = x;
    this.y = y;
    this.z = z;
}

Node.prototype = {
    'id':0,
    'x':0,
    'y':0,
    'z':0,
    'toString':function(){
        return "The node id is: "+this.id+"\nIt's coordinates are: "+this.x+","+this.y+","+this.z;
    }
};

var malledim = {
    'setModel':function(model){
        protectedModel = model;
    },
    'getModel':function(){
        return protectedModel;
    },
    /**
     * Based on model objects creates an Array structure that is easier to process
     * It uses an object to simulate 1 based indexed array access
     */

    // Todo: Compare speed on Array based struct
    'computeStruct':function(){
        var superStructure = {};
        var floorMap = protectedModel.structure.floorMap;
        var i; // Dummy variable for loops

        // Initializes superstructure x axis array
        for(i=0;i<protectedModel.xAxis.length;i++){
            superStructure[i+1]={};
            superStructure[i+1].length=0;
        }

        // Adds other info as an object
        for(i=0; i < floorMap.length; i++){
            superStructure[floorMap[i].coords.x][floorMap[i].coords.y] = floorMap[i].floors;
            superStructure[floorMap[i].coords.x].length++;
        }
        superStruct = superStructure;
    },
    'getSStructOnX':function(){
        if(!superStruct){
            this.computeStruct();
        }
        var superStructure = [];
        //dummy var
        var item;
        for(item in superStruct){
            superStructure[item-1]=superStruct[item].length;
        }
        return superStructure;
    },
    'getSStructOnY':function(){
        // Todo: Right now it works with sorted set but it should be able to sort it by itself
        if(!superStruct){
            this.computeStruct();
        }
        var superStructure = [];
        //dummy var
        var item,subitem,tmp;
        for(item in superStruct){
            if(superStruct[item].length>0){
                for(subitem in superStruct[item]){
                    if(subitem!='length'){
                        tmp={};
                        tmp[subitem]=superStruct[item][subitem];
                        superStructure.push(tmp);
                    }
                }
            }
        }
        return superStructure;
    },
    'getCoordAdjustments':function(){
        return protectedModel.structure.coordAdjustments;
    },
    'getPOA':function(){
        return protectedModel.structure.pointsOfAnalysis;
    },
    /**
     * Get coordinate's floors one-based indexes
     */
    'getFloors':function(xAxis,yAxis){
        // Todo: It's not checking for lower or higher bounds
        if(superStruct.hasOwnProperty(xAxis)){
            if(superStruct[xAxis].hasOwnProperty(yAxis)){
                return superStruct[xAxis][yAxis];
            }
        }
        return 0;
    },
    'createNodes':function(config){
        var warn = config.warnings;
//        warning('Just a test...',warn);
        protectedModel.structure.nodes=[];

        var strataLines = protectedModel.soil.strata + 1;

        var xAx = protectedModel.xAxis,
            yAx = protectedModel.yAxis,
            zAx = protectedModel.zAxis;

        var floorMap = protectedModel.structure.floorMap;

        // Dummy Variables
        var xTop,yTop,zTop;
        var i, j,k;

        // Here we create all the free field's nodes
        xTop=xAx.length;
        yTop=yAx.length;

        for(i=0;i<xTop;i++){
            for(j=0;j<yTop;j++){
                for(k=0;k<strataLines;k++){
                    var node = new Node(xAx[i],yAx[j],zAx[k]);
                    warning(node.toString(),warn);
                    protectedModel.structure.nodes.push(node);
                    // Here we should add them to the indexes
                }
            }
        }

        // Here we create all the structure's nodes
        for(i=0;i<floorMap.length;i++){
            var item = floorMap[i];

            zTop=strataLines + item.floors;
            for(j=strataLines;j<zTop;j++){
                var node = new Node(xAx[item.coords.x - 1],yAx[item.coords.y - 1],zAx[j]);
                warning(node.toString(),warn);
                protectedModel.structure.nodes.push(node);
                // Here we should add them to the indexes
            }
        }

        warning(JSON.stringify(protectedModel.structure.nodes),warn);

    }
};

module.exports = malledim;