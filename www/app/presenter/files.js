define( ["model/gpx", "model/pointseq", "model/file"], function(gpxModel, pointseq, fileModel) {
	"use strict";

	var views = [];
	function registerView(v) {
		views.push(v);
		return { };	// return settings
	}
	var loadGpxFile = function(file, contents) {
		//console.log("presenter/files: " + file.name);
		var gpx = new gpxModel.Gpx(file, contents);
		new fileModel.File(file, gpx);
	};

	var pub = {
		registerView: registerView,
		loadGpxFile: loadGpxFile
	};
	return pub;
});
