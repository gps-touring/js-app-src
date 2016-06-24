define( ["model/state", "jszip", "FileSaver"], function(state, JSZip, fs) {
	"use strict";

	var view;

	function importGpx() {
		// Find and click the hidden <input> element.
		// See https://developer.mozilla.org/en/docs/Using_files_from_web_applications#Using_hidden_file_input_elements_using_the_click()_method
		var inputElem = document.getElementById("files");
		if (inputElem) {
			inputElem.click();
		}
	}
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

	function registerView(v) {
		view = v;
		return {
			menus: [
				{
					text: "File",
					items: [
						{ text: "Import GPX", click: importGpx },
						{ text: "Download zip", click: downloadZip }
					]
				},
				{
					text: "View",
					items: [
						//{ text: "Original GPX routes", click: state.viewRoutes(state.viewRouteEnum.original) },
						//{ text: "Simplified GPX routes", click: state.viewRoutes(state.viewRouteEnum.original) }

						//{ text: "Original GPX routes", click: state.viewOriginalRoutes },
						//{ text: "Simplified GPX routes", click: state.viewSimplifiedRoutes }

						{ text: "Original routes", click: state.changer("viewRoutes", "original")},
						{ text: "Simplified routes", click: state.changer("viewRoutes", "simplified") }
					]
				},
				{
					text: "Help",
					items: []
				}
			]
		};	// return settings
	}

	var pub = {
		registerView: registerView
	};
	return pub;
});
