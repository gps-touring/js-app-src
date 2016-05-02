// This is the place where the various views are pulled into the application.
define(
	["d3", "view/map", "view/menu", "view/tabs"],
	function(d3, map, menu, tabs) {
		"use strict";

		var priv = {
			init: function() {
				// Get rid of "Loading..." messages:
				d3.selectAll(".delete-when-loaded").remove();
				map.init();
				menu.init();

				// Initialize the tabs controls, and the content of each tab:
				tabs.init();
			}
		};
		var pub = {
			init: priv.init
		};
		return pub;
	});

