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
							click: function() { console.log("Import GPX");}
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
