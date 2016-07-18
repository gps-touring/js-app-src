define( ["model/state", "model/zipfile"], function(state, zipFile) {
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

	function registerView(v) {
		view = v;
		return {
			menus: [
				{
					text: "File",
					items: [
						{ text: "Import GPX", click: importGpx },
						{ text: "Download zip", click: zipFile.downloadZip }
					]
				},
				{
					text: "View",
					items: [
						{ text: "Original routes", click: state.viewOriginalRoutes },
						{ text: "Simplified routes", click: state.viewSimplifiedRoutes }
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
