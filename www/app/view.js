// This is the place where the various views are pulled into the application.
define(
	["d3", "view/files", "view/map", "view/menu"],
	function(d3, files, map, menu) {	//eslint-disable-line no-unused-vars
		"use strict";

		var priv = {
			init: function() {
				// Get rid of "Loading..." messages:
				d3.selectAll(".delete-when-loaded").remove();
				files.init();
				map.init();
				menu.init();
			}
		};
		var pub = {
			init: priv.init
		};
		return pub;
	});

