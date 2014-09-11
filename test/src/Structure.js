/**
 * The structure object represents a physical structure
 * It has axis defined and a Typed Array for allowing big structures to be represented in WebGL
 * without significant performance issues.
 *
 * The xyz coordinate frame is left-handed with z axis coming out of the screen
 */

/*
// Works for encapsulation but I prefer the prototype structure
var Structure = function (w) {
    var width = w || 0;

    return {
        function: function(){
            console.log(width);
        }
    }
};
*/

/**
 * Represents a 3D structure
 * @constructor
 * @param {number} width - The number of axis parallel to z on the xy plane
 * @param {number} height - The number of axis parallel to x on the xz plane
 * @param {number} depth - The number of axis parallel to x in the xy plane
 */

var Structure = function (width,height,depth) {
    this.width = width || 0;
    this.height = height || 0;
    this.depth = depth || 0;

    this.structureArray = new Int8Array(this.totalSize);
    console.log(this.toString());
    console.log(this.structureArray);
};

Structure.prototype = {
    /*
    * rowSize calculates the number of bytes required for storing a row
    */
    get rowSize() {
        return parseInt(this.width / 8) + ( (this.width % 8 == 0)?0:1 );
    },
    /*
     * baseSize calculates the number of bytes required for storing the structure's base
     */
    get baseSize() {
        return this.rowSize * this.depth;
    },
    /*
     * totalSize calculates the number of bytes required for storing the complete structure
     */
    get totalSize() {
        return this.baseSize * this.height;
    },
    resize: function () {
        // todo: converts the current array to a new one that fits better to the dimensions, it should checks for a change first
    },
    /**
     * Returns general information about the structure
     */
    toString: function(){
        return 'The structure dimensions are: \n Width: '+ this.width + '\n Depth:' + this.depth + '\n Height: '+ this.height;
    },
    /**
     * Checks if the node at given coordinates exists
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} z - Z coordinate
     */
    nodeExists: function(x,y,z){
        // todo: checks if node at given coordinates exists
    },
    /**
     * Returns an array of the objects in a given plane
     * @param {string} axis - selected axis, right now just main orthogonal axis
     * @param {number} coord - axis coordinate
     */
    getPlane: function(axis,coord){
        // todo: returns an array of the objects in a given plane
    },
    /**
     * Returns an array of the objects in a given plane
     * @param {object} structJSON - JSON structure description object
     */
    setStructure: function(structJSON){
    },

}
