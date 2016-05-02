define( ["model/gpx", "model/pointseq"], function(gpx, pointseq) {
	"use strict";

	var views = [];
	function registerView(v) {
		views.push(v);
		return { };	// return settings
	}
	var loadGpxFile = function(file, contents) {
		//console.log("presenter/files: " + file.name);
		var gpxObject = gpx.parseGpxStr(contents);
		if (gpxObject !== null) {
			//pointseq.addFromGpx(file, gpxObject);
			gpxObject.getPointSeqs().forEach(function(e) {
				new pointseq.PointSeq(file, e);
			});
		}
		// TODO - sort this out. It's here just to exercize the code.
		gpxObject.getWaypoints();
	};

	var pub = {
		registerView: registerView,
		loadGpxFile: loadGpxFile
	};
	return pub;
});
