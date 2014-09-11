/**
 * Helper functions
 */


Helpers = {
    /**
     * Takes an integer and puts it into a binary representation as an array
     * Can accept a function for executing it for each position on true or false
     */
    binArrayExec: function(number,callback){
        var result = number.toString(2);
        if(callback != undefined){
            for (var i = 0; i < result.length; i++) {
                callback(result[i]);
            }
        }
        return result;
    }
}