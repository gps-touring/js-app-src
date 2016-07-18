define( ["jszip", "FileSaver"], function(JSZip, fs) {
	"use strict";

	function downloadZip() {
		// Using https://stuk.github.io/jszip/ and https://github.com/eligrey/FileSaver.js
		// See https://stuk.github.io/jszip/documentation/examples.html
		// See https://stuk.github.io/jszip/documentation/howto/write_zip.html
		var zip = new JSZip();
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
