define( ["jszip", "FileSaver", "model/file", "model/route"], function(JSZip, fs, fileModel, routeModel) {
	"use strict";

	function compileRoutes() {
		var res = [];
		// We don't really want GPX routes based on our Route objects, we want them based on a journey between
		// origin and destination.
		// This remains asn an illustration of populating the fileName and fileContent properties. 
		//routeModel.getAll().forEach(function(e) {
			//PROBLEM: duplicate file names, if the sae original GPX file had more than one trkseg, for example.
			//res.push({ fileName: e.original.source.name, fileContent: "TEST" });
		//});
		var i = 0;
		fileModel.getAll().forEach(function(f) {
			i = 0;
			f.gpxObject.routes.forEach(function(r) {
				res.push({fileName: f.source.name + "_" + i + ".gpx", fileContent: r.simplified.toGpx()});
				++i;
			});
		});
		return res;
	}
	function addToZip(zip, prefix, objects) {
		// Process and array of objects { fileName: ? fileContent: ?}
		objects.forEach(function(e) {
			zip.file(prefix + e.fileName, e.fileContent);
		});
	}
	function downloadZip() {
		// Using https://stuk.github.io/jszip/ and https://github.com/eligrey/FileSaver.js
		// See https://stuk.github.io/jszip/documentation/examples.html
		// See https://stuk.github.io/jszip/documentation/howto/write_zip.html
		var zip = new JSZip();
		addToZip(zip, "routes/simplified/", compileRoutes());
		zip.file("foo.txt", "foo\n");
		zip.file("bar/foo.txt", "barfoo\n");
		zip.generateAsync({type: "blob"})
		.then(function (blob) {
			var filename = "gps-touring-test.zip";
			console.log("saving zip as " + filename);
			// TODO - error handling and reporting
			saveAs(blob, filename);
		});
	}

	var pub = {
		downloadZip: downloadZip
	};
	return pub;
});
