var Flak = {
	edit_area_canvas: null,
	wave_area_canvas: null,
	overlay_area_canvas: null,
	ui: null,
	wave_ui: null,
	overlay_ui: null,
	curveEditor: null,
	barSelector: null,
	nSamples: 2048,
	bigPlayArray: [],
	currentSample: 0,
	volEditor: null,
	arraySplitted: null
};

Flak.init = function () {
	// Function.prototype.bind polyfill
  	if ( !Function.prototype.bind ) {
  	 
  	  Function.prototype.bind = function( obj ) {
  	    if(typeof this !== 'function') // closest thing possible to the ECMAScript 5 internal IsCallable function
  	      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  	 
  	    var slice = [].slice,
  	        args = slice.call(arguments, 1),
  	        self = this,
  	        nop = function () {},
  	        bound = function () {
  	          return self.apply( this instanceof nop ? this : ( obj || {} ),
  	                              args.concat( slice.call(arguments) ) );   
  	        };
  	 
  	    bound.prototype = this.prototype;
  	 
  	    return bound;
  	  };
  	}
  	
  	window.sessionStorage.editMode = 'curve';
        
    // INITIALIZE UIs
    Flak.edit_area_canvas = document.getElementById("edit_area");
    Flak.ui = new K2.UI ({type: 'CANVAS2D', target: Flak.edit_area_canvas});
    
    Flak.overlay_area_canvas = document.getElementById("overlay_area");
    Flak.overlay_ui = new K2.UI ({type: 'CANVAS2D', target: Flak.overlay_area_canvas});
    
    Flak.wave_area_canvas = document.getElementById("wave_area");
	Flak.wave_ui = new K2.UI ({type: 'CANVAS2D', target: Flak.wave_area_canvas});
    
    var dropElement = document.getElementById("overlay_area");
 	
 	// INITIALIZE DROP
    // init event handlers
    dropElement.addEventListener("dragenter", Flak.noopHandler, false);
    dropElement.addEventListener("dragexit", Flak.noopHandler, false);
    dropElement.addEventListener("dragover", Flak.noopHandler, false);
    dropElement.addEventListener("drop", Flak.drop, false);
    
    // INITIALIZE AUDIO
    Flak.initAudio();
    
	// INITIALIZE ELEMENTS
	
	// the Wave Grid
    var waveGridArgs = {
        ID: "wave_grid",
        top: 0,
        left: 0,
        width: Flak.wave_area_canvas.width,
        height: Flak.wave_area_canvas.height,
        columns: 2,
        rows: 16,
        style: 'dashed',
        lineColor: 'yellow',
        bgColor: '#1f2020',
        lineWidth: 0.2,
        dashArray: [10,2]
    };
    
    var waveGrid = new K2.Grid(waveGridArgs);
    Flak.wave_ui.addElement(waveGrid);
    Flak.wave_ui.refresh();

    // the Edit Grid
    var gridArgs = {
        ID: "grid",
        top: 0,
        left: 0,
        width: Flak.edit_area_canvas.width,
        height: Flak.edit_area_canvas.height,
        columns: 16,
        rows: 16,
        style: 'dashed',
        lineColor: 'PapayaWhip',
        bgColor: '#1f2020',
        lineWidth: 0.1,
        dashArray: [12,4],
    };

    var grid = new K2.Grid(gridArgs);
    
    Flak.ui.addElement(grid);
    
    // The Overlay Bar
    var barArgs = {
            ID: "bar",
            left: 0,
            top : 0,
            orientation: 1,
            thickness: 4,
            height: Flak.overlay_area_canvas.height,
            width: Flak.overlay_area_canvas.width,
            onValueSet: function (slot, value) {
                console.log ("Event on slot " + slot + " with value " + value);
                Flak.overlay_ui.refresh();
            }.bind(this),
            barColor: 'LightGreen',
            transparency: 0.5
        };
        
    Flak.overlay_ui.addElement(new K2.Bar(barArgs));
    Flak.overlay_ui.setVisible('bar', false);
    Flak.overlay_ui.refresh();
    
    // Initialize Curve Editor
    // Editor callback
    var editorCallback = function (slot, value, element) {
    	if (slot === 'points') {
    		var where = Flak.ui.getProp (element, 'whereHappened');
    		Flak.overlay_ui.setValue ({elementID: 'bar', slot: "barPos", value: where});
    	}
    }
    
	Flak.curveEditor = new CurveEditor ({
    	ui: Flak.ui,
    	canvas: Flak.edit_area_canvas,
    	helperColor: "white",
    	curveColor: "LemonChiffon",
    	terminalPointFill: "SandyBrown",
    	selectedCurveColor: "Crimson",
    	callback: editorCallback,
    	curveLabels: false,
    	xMonotone: true,
    	zIndex: 10
    });
    
    /* Add the initial diagonal curve in the editor */
    Flak.curveEditor.addCurve('linear', 1, [0, Flak.edit_area_canvas.height], [Flak.edit_area_canvas.width, 0]);
    
    /* Bar selector */
    Flak.barSelector = new BarSelect ({ ui: Flak.ui,
                                        canvas: Flak.edit_area_canvas,
                                        callback: Flak.volumeCallback,
                                        areaColor: "white",
                                        areaTransparency: 0.1,
                                        zIndex: 500});
                                        
    Flak.volEditor = new Flak.VolumeEditor (Flak.edit_area_canvas.width);
    Flak.volumeAreaRefresh();
                
    Flak.ui.refresh();
	
};