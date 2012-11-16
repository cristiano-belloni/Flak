Flak.successCallback = function (decoded) {
    console.log ("Decode succeeded!");
    
    Flak.overlay_ui.setVisible('bar', true);
    
    Flak.decoded_arrayL = decoded.getChannelData (0);
    Flak.decoded_arrayR = decoded.getChannelData (1);
    console.log ("I got the data!");
	
	var waveID = 'wavebox_L';
	
	if (!(Flak.wave_ui.isElement(waveID))) {
	
        // Wavebox parameters
        var waveboxArgs = {
            ID: waveID,
            top: 0,
            left: 0,
            width: Flak.wave_area_canvas.width,
            height: Flak.wave_area_canvas.height,
            // Todo must invert here
            orientation: 1,
            isListening: true,
			waveColor: '#CC0000',
			transparency: 0.8
        };
        
        waveboxArgs.onValueSet = function () {
            var that = this;
            return function (slot, value) {
                console.log ("onValueSet callback: slot is ", slot, " and value is ", value, " while that is ", that);
                Flak.wave_ui.refresh();
            };
    	}();

        var waveBox_L = new K2.Wavebox(waveboxArgs);
        

        Flak.wave_ui.addElement(waveBox_L);
    }

	// Array must be reversed (to be correctly displayed and processed)
	Array.prototype.reverse.call(Flak.decoded_arrayL);
	Array.prototype.reverse.call(Flak.decoded_arrayR);
	//var temp32Array = decoded_arrayL;
    Flak.wave_ui.setValue ({elementID: waveID, slot: "waveboxsignal", value: Flak.decoded_arrayL});     

    Flak.wave_ui.refresh();
    
}

Flak.errorCallback = function () {
    console.log ("Error!");
    alert ("Error decoding ");
    Flak.overlay_ui.setVisible('bar', false);
}   

Flak.handleReaderLoad = function (evt) {
    console.log (evt);
    
    console.log ("Decoding file");
    
    Flak.audioContext.decodeAudioData(evt.target.result, Flak.successCallback, Flak.errorCallback);
    
}

Flak.handleFiles = function (files) {
    
    var file = files[0];

    console.log ("Loading ", file.name);

    var reader = new FileReader();

    // init the reader event handlers
    reader.onload = Flak.handleReaderLoad;

    // begin the read operation
    reader.readAsArrayBuffer(file);
}
 
Flak.drop = function (evt) {
	evt.stopPropagation();
	evt.preventDefault();
 
	var files = evt.dataTransfer.files;
    var count = files.length;
 
    // Only call the handler if 1 or more files was dropped.
    if (count > 0)
    Flak.handleFiles(files);
}
 
Flak.noopHandler = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
}