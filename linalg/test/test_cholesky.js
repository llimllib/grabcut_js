module("tests");

test("requirements", function() {
    expect(1);
    ok($M, "$M"); //need to have Sylvester defined
});

test("cholesky", function() {
    expect(7);

    var m = $M([[1,0],[0,1]]);
    same(cholesky(m), m);

    var a = $M([[4,-2,-6],[-2,10,9],[-6,9,14]]);
    same(cholesky(a), $M([[2,0,0],[-1,3,0],[-3,2,1]]));

    //make sure we haven't modified a
    same(cholesky(a), $M([[2,0,0],[-1,3,0],[-3,2,1]]));

    //make sure we're not just saying ok to everything
    ok(cholesky(a).elements[0][0] != 3)

    //this should fail; non-square matrix
    function exc(f) {
        try { f(); } catch(e) { return e } return false;
    }

    var empty = function() { cholesky($M([])); }
    ok(exc(empty), "fail on an empty matrix");

    var nonsquare = function() { cholesky($M([[1,0,0],[3,0,0]])); }
    ok(exc(nonsquare), "fail on a nonsquare matrix");

    var nonhermitian = function() { cholesky($M([[1,2,3],[4,5,6],[7,8,9]])); }
    ok(exc(nonhermitian), "fail on a nonhermitian matrix");
});
