Flak.volAreaArgs = {
    ID: "",
    left: 0,
    top : 0,
    thickness: 0,
    onValueSet: function (slot, value) {
        console.log ("Event on slot " + slot + " with value " + value);
        Flak.ui.refresh();
    },
    color: 'DarkRed',
    transparency: 0.2,
    move: 'none',
    drag: {top: false, bottom: false, right: false, left: false},
    isListening: false
};

Flak.VolumeEditor = function (width) {
    this.volumeArray = [];
    var i = width;
    
    /* Fill the array with zeros (no mute, full volume) */
    while (i--) {
        this.volumeArray[i] = 0;
    }
    
    this.fillInterval = function (start, end, value) {
        if ((value === 0) || (value === 1)) {
            var len = end - start;
            var index;
            for (index = 0; index < len; index += 1) {
                this.volumeArray [start + index] = value;
            }
        }
        else {
            throw ("Value is not 0 or 1", value);
        }
    }
    
    this.arraySplit = function () {
        var ret = [];
        var i;
        var status = this.volumeArray[0];
        var start = 0;
        for (i = 1; i <= this.volumeArray.length; i += 1) {
            if (i === this.volumeArray.length) {
                ret.push ({start: start, end: i-1, type: status});
            }
            else if (this.volumeArray[i] !== status) {
                ret.push ({start: start, end: i-1, type: status});
                start = i; 
                status = this.volumeArray[i];
            }
        }
        return ret;
    }
    
    this.getVolumeValue = function (sample) {
        return this.volumeArray[sample];
    }
}; 

Flak.volumeCallback = function (slot, value, element) {
    if (window.sessionStorage.editMode === 'volume') {
        if (slot === 'dragEnd') {
            /* Get the start / end x values of the barSelector */
            var start = Flak.barSelector.selectStart;
            var width = Flak.barSelector.selectWidth;
            var end = start + width;
            
            var selectStatus = Flak.muteUnmute;
            
            Flak.volEditor.fillInterval (start, end, selectStatus);
            
            Flak.volumeAreaRefresh();
       }
    }
};

Flak.volumeAreaRefresh = function () {
    
    if (Flak.arraySplitted !== null) {
        // Delete the previous zones
        
	        for (i = 0; i < Flak.arraySplitted.length; i += 1) {
	        	if (Flak.arraySplitted[i].type !== 0) {
	            	var id = 'volArea' + i;
	            	Flak.ui.removeElement (id);
	            }
	        }
    }
   
   Flak.arraySplitted = Flak.volEditor.arraySplit();
    
    // Add the new zones
    for (i = 0; i < Flak.arraySplitted.length; i += 1) {
    	if (Flak.arraySplitted[i].type !== 0) {
	        var newAreaArgs = K2.GenericUtils.clone(Flak.volAreaArgs);
	        newAreaArgs.ID = 'volArea' + i;
	        newAreaArgs.height = Flak.edit_area_canvas.height;
    		newAreaArgs.width = Flak.edit_area_canvas.width;
	        var newArea = new K2.Area(newAreaArgs);
	        newArea.values.xOffset = Flak.arraySplitted[i].start;
	        newArea.values.width = Flak.arraySplitted[i].end - Flak.arraySplitted[i].start;
	        Flak.ui.addElement(newArea, {zIndex: 5});
        }
    }
    Flak.ui.refresh();
};

Flak.volumeAreasSetTransparency = function (value) {
    for (i = 0; i < Flak.arraySplitted.length; i += 1) {
    	if (Flak.arraySplitted[i].type !== 0) {
            var id = 'volArea' + i;
            var el = Flak.ui.getElement (id);
            el.transparency = value;
		}
	}
	Flak.volAreaArgs.transparency = value;
};
