Flak.process = function(event) {
        
    // Get left/right input and output arrays
    var outputArray = [];
    outputArray[0] = event.outputBuffer.getChannelData(0);
    outputArray[1] = event.outputBuffer.getChannelData(1);
    var dataLen = outputArray[0].length;
    
    if (Flak.playing) {
        
        for (var i = 0; i < dataLen; i+=1) {
            
            // y values are already reversed
            if (Flak.currentSample >= Flak.bigPlayArray.length) {
                Flak.playing = false;
                // This should mitigate clicks
                Flak.gainNode.gain.value = 0;
                break;
            }
            
            else {
                var index = Math.round(Flak.bigPlayArray[Flak.currentSample]);
                
                var visStep = Math.ceil((Flak.decoded_arrayL.length * 5 / Flak.wave_area_canvas.height));
                if (!(Flak.currentSample % visStep)) {
                    var yValue = index * Flak.wave_area_canvas.height / Flak.decoded_arrayL.length;
                    Flak.overlay_ui.setValue ({elementID: 'bar', slot: "barPos", value: [0,yValue]});
                }
                
                // Volume values
                var xValue = Math.ceil(Flak.currentSample * Flak.wave_area_canvas.width / Flak.decoded_arrayL.length);
                if (Flak.currentVolume !== Flak.volEditor.getVolumeValue(xValue)) {
                    Flak.currentVolume = Flak.volEditor.getVolumeValue(xValue);
                    // Muted is 1, invert
                    console.log ("Changing gain to ", Math.abs (Flak.currentVolume - 1));
                    Flak.gainNode.gain.value = Math.abs (Flak.currentVolume - 1);
                }
                 
                
                outputArray[0][i] = Flak.decoded_arrayL[index];
                outputArray[1][i] = Flak.decoded_arrayR[index];
            }
            Flak.currentSample+=1;
        }
    }
    
    else {
        for (var i = 0; i < dataLen; i+=1) {
            outputArray[0][i] = 0;
            outputArray[1][i] = 0;
        }
    }        
};

Flak.initAudio = function () {
	Flak.audioContext = new webkitAudioContext();
	Flak.source = Flak.audioContext.createJavaScriptNode(Flak.nSamples);
	Flak.source.onaudioprocess = Flak.process;
	Flak.gainNode = Flak.audioContext.createGainNode();
	Flak.source.connect(Flak.gainNode);
	Flak.gainNode.connect(Flak.audioContext.destination);
};

Flak.play  = function () {
    console.log ("Playing");
    
    Flak.playArray = [];
    
    var curveArray = Flak.curveEditor.status.curveArray;
    for (var i = 0; i < curveArray.length; i+=1) {
    	var curve = Flak.ui.getElement (curveArray[i]);
    	/* Time: 4 squares = the entire sample */
    	var unitaryTime = Flak.edit_area_canvas.width / 4;
    	/* sampleStartValue in the waveform: y value of the starting point of the curve
    	 * divided for the height of the canvas,
    	 * multiplied by the total sample number
    	 */
    	var sampleStartValue = (Flak.edit_area_canvas.height - curve.values.points[0][1]) / Flak.edit_area_canvas.height * Flak.decoded_arrayL.length;
    	/* Same for the end value */
    	var sampleEndValue = (Flak.edit_area_canvas.height - curve.values.points[curve.values.points.length - 1][1]) / Flak.edit_area_canvas.height * Flak.decoded_arrayL.length;
    	
    	/* samplesToPlay depends on the width of the curve (time) */
    	var samplesToPlay = (curve.values.points[curve.values.points.length - 1][0] - curve.values.points[0][0]) / Flak.edit_area_canvas.width * 4;
    	
    	console.log ("curve is: ", curveArray[i], "start / end / len: ", sampleStartValue, sampleEndValue, Flak.decoded_arrayL.length);
    	console.log ("Samples to play: ", samplesToPlay, samplesToPlay * Flak.decoded_arrayL.length);
    	
    	// Populate the Play Array
    	if (samplesToPlay !== 0) {
    	    Flak.playArray.push ({curveElement: curve,
    	                          startSample: sampleStartValue,   
    	                          endSample: sampleEndValue,
    	                          toPlay: samplesToPlay * Flak.decoded_arrayL.length});
    	}
    }
    
    // Build the big array
    Flak.bigPlayArray = [];
    Flak.currentSample = 0;
    for (i = 0; i < Flak.playArray.length; i+=1) {
            
            var currentCurve = Flak.playArray[i].curveElement;
            // How many samples we need
            var toPlay =  Flak.playArray[i].toPlay;         
            
            // The whole curve (y starts from top)
            var curvePoints = currentCurve.getCurveYPoints(toPlay, Flak.decoded_arrayL.length / currentCurve.height);
            
            Flak.bigPlayArray = Flak.bigPlayArray.concat(curvePoints);
            
            // Now, play the due curveSamples
            //var samplesIndexArray = Flak.curveSamples.slice(currentSample, dataLen); 
            
        }
    
    Flak.gainNode.gain.value = 1;
    // Start playing
    Flak.playing = true;
        
};
    
Flak.stop = function () {
    console.log ("Stopping");
    Flak.playing = false;
    Flak.currentVolume = 0;
};