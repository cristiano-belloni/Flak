Flak.addCB = function () {
    Flak.curveEditor.addCurve("linear", 0);
};

Flak.removeCB = function  () {
    Flak.curveEditor.removeCurve();
};

Flak.clearCB = function () {
    Flak.curveEditor.clearCurve();
};

Flak.curveTypeClicked = function (type) {
    
    var curveType = type;
    console.log ("clicked curveType ", curveType);
    var grade = 0;
    
    if (curveType.indexOf('bezier') == 0) {
        grade = parseInt(curveType.charAt(6), 10);
        curveType = 'bezier';
        console.log ("Curve is bezier and grade is " + grade);
    }
    
    Flak.curveEditor.modifyCurve(curveType, grade);
    
}
