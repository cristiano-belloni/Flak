Flak.curveEdit = function () {
    // Callback called when pressing the curve button
    $("#volumeIcons").hide();
    $("#curveIcons").show();
    Flak.curveEditor.setListening (true);
    Flak.curveEditor.setTransparency (0.8);
    Flak.volumeAreasSetTransparency (0.2);
    Flak.ui.refresh();
    window.sessionStorage.editMode = 'curve';
}
Flak.volumeEdit = function () {
    // Callback called when pressing the volume button
    $("#curveIcons").hide();
    $("#volumeIcons").show();
    Flak.curveEditor.setListening (false);
    Flak.curveEditor.setTransparency (0.2);
    Flak.volumeAreasSetTransparency (0.4);
    Flak.ui.refresh();
    window.sessionStorage.editMode = 'volume';
}
