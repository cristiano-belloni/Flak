Flak.parseCurveType = function (frm) { 
    var curveType = null;
    var grade = null;
        
        for (i = 0; i < frm.buttontype.length; i++) {
            if (frm.buttontype[i].checked) {
                curveType = frm.buttontype[i].value;
            }
        }
        
        if (curveType === null) curveType = 'linear';
        
        console.log ('Add: curve type is ' + curveType);
        
        if (curveType.indexOf('bezier') == 0) {
            var grade = parseInt(curveType.charAt(6), 10);
            curveType = 'bezier';
            console.log ("Curve is bezier and grade is " + grade);
        }
        
        return [curveType, grade];
};

Flak.addCB = function (frm) {
    var parsed = Flak.parseCurveType (frm);
    Flak.curveEditor.addCurve(parsed[0], parsed[1]);
};

Flak.removeCB = function  () {
    Flak.curveEditor.removeCurve();
};

Flak.clearCB = function () {
    Flak.curveEditor.clearCurve();
};

Flak.applyCB = function (frm) {
    var parsed = Flak.parseCurveType (frm);
    Flak.curveEditor.modifyCurve(parsed[0], parsed[1]);
};