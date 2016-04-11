define( ["model/gpx"], function(gpx) {
	"use strict";

	var loadGpxFile = function(file, contents) {
		console.log("presenter/files: " + file.name);
		gpx.parseGpxStr(contents);
	};

	var pub = {
		loadGpxFile: loadGpxFile
	};
	return pub;
});
