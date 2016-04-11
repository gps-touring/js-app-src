define( ["model/gpx", "model/wptseq"], function(gpx, wptseq) {
	"use strict";

	var views = [];
	function registerView(v) {
		views.push(v);
		return { };	// return settings
	}
	var loadGpxFile = function(file, contents) {
		console.log("presenter/files: " + file.name);
		var res = gpx.parseGpxStr(contents);
		if (res !== null) {
			wptseq.addFromGpx(file, res);
			//mapView.showLatLngSeq(wptseq.toLatLngs());
		}
	};

	var pub = {
		registerView: registerView,
		loadGpxFile: loadGpxFile
	};
	return pub;
});
