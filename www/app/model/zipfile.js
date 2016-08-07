define( ["jszip", "FileSaver", "model/pointseq"], function(JSZip, fs, ptSeqModel) {
	"use strict";

	function compileRoutes() {
		var res = [];

		// We are creating GPX files from 'simplified' PointSeq objects, which have been designed to
		// be used for output:
		ptSeqModel.getAllSimplified().forEach(function(ptSeq) {
			console.log("zipfile.compileRoutes: " + ptSeq.name);
			res.push({fileName: ptSeq.fileName, fileContent: ptSeq.toGpx()});
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
		zip.file("info.txt", "Created by gps-touring");
		addToZip(zip, "routes/simplified/", compileRoutes());
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
