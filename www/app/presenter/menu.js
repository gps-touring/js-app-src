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
								var inputElem = document.getElementById("files");
								if (inputElem) {
									inputElem.click();
								}
							}
						},
						{
							text: "Download zip",
							click: function() { console.log("Download zip");}
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
