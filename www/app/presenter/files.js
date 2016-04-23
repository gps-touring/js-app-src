define( ["model/gpx", "model/wptseq"], function(gpx, wptseq) {
	"use strict";

	var views = [];
	function registerView(v) {
		views.push(v);
		return { };	// return settings
	}
	var loadGpxFile = function(file, contents) {
		console.log("presenter/files: " + file.name);
		var gpxData = gpx.parseGpxStr(contents);
		if (gpxData !== null) {
			wptseq.addFromGpx(file, gpxData);
		}
	};

	var pub = {
		registerView: registerView,
		loadGpxFile: loadGpxFile
	};
	return pub;
});
