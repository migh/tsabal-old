describe("Structure", function(){
    var structure;
    var w, h,d;
    var UPPER_LIMIT = 100;

    beforeEach(function(){
        w = Math.ceil(Math.random()*1000) % UPPER_LIMIT;
        h = Math.ceil(Math.random()*1000) % UPPER_LIMIT;
        d = Math.ceil(Math.random()*1000) % UPPER_LIMIT;
        structure = new Structure(w,h,d);
    });

    it("should be created", function(){
        expect(structure).toBeDefined();
    });

    it("should be created with given width, height and depth", function(){
        expect(structure.width).toEqual(w);
        expect(structure.height).toEqual(h);
        expect(structure.depth).toEqual(d);
    });

    it("rowSize should be the first multiple of 8 bigger than the number", function(){
        structure.width = 7;
        expect(structure.rowSize).toEqual(1);
        structure.width = 23;
        expect(structure.rowSize).toEqual(3);
        structure.width = 58;
        expect(structure.rowSize).toEqual(8);
        structure.width = 3446;
        expect(structure.rowSize).toEqual(431);
    });

    it("baseSize should be depth times rowSize", function(){
        structure.depth = 5;
        structure.width = 7;
        expect(structure.baseSize).toEqual(5);
        structure.width = 23;
        expect(structure.baseSize).toEqual(15);
        structure.width = 58;
        expect(structure.baseSize).toEqual(40);
        structure.width = 3446;
        expect(structure.baseSize).toEqual(2155);
    });

    it("totalSize should be height times baseSize", function(){
        structure.depth = 5;
        structure.height = 7;

        structure.width = 7;
        expect(structure.totalSize).toEqual(35);
        structure.width = 23;
        expect(structure.totalSize).toEqual(105);
        structure.width = 58;
        expect(structure.totalSize).toEqual(280);
        structure.width = 3446;
        expect(structure.totalSize).toEqual(15085);
    });

});