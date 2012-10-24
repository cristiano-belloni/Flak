<canvas id="zoom_area"
            style="z-index: 5;
            position:absolute;
            left:220px;
            top:807px;"
            height="35px" width="768px">
            This text is displayed if your browser does not support HTML5 Canvas.
</canvas>

// The Band
    bandArgs = {
            ID: "measureBand",
            left: 0,
            top : 0,
            xOffset: 0,
            yOffset: 0,
            thickness: 4,
            xOffset: 2,
            yOffset: -1,
            height: Flak.zoom_area_canvas.height - 4,
            width: Flak.edit_area_canvas.width / 4 - 4,
            onValueSet: function (slot, value) {
                console.log ("Event on slot " + slot + " with value " + value);
               	Flak.zoom_ui.refresh();
            }.bind(this),
            color: 'ForestGreen',
            transparency: 0.8,
            move: false,
            isListening: true
        };
        
    Flak.zoom_ui.addElement(new K2.Band(bandArgs));
    Flak.zoom_ui.refresh();