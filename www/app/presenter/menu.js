define( [], function() {
	"use strict";

	var view;
	function registerView(v) {
		view = v;
		return {
			menus: [
				{
					text: "File",
					items: [
						{
							text: "Import GPX",
							click: function() {
								// Find and click the hidden <input> element.
								// See https://developer.mozilla.org/en/docs/Using_files_from_web_applications#Using_hidden_file_input_elements_using_the_click()_method
								var inputElem = document.getElementById("files");
								if (inputElem) {
									inputElem.click();
								}
							}
						},
						{
							text: "Download zip",
							click: function() { console.log("Download zip"); }
						}
					]
				},
				{
					text: "View",
					items: []
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
