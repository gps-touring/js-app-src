// This is the place where the various views are pulled into the application.
define(
	["d3", "view/map"],
	function(d3, map) {	//eslint-disable-line no-unused-vars
		"use strict";

		var priv = {
			init: function() {
				// Get rid of "Loading..." messages:
				d3.selectAll(".delete-when-loaded").remove();

				//var mapContainer = d3.select("#app-frame").append("div").attr("id", "map");

				map.init();
			}
		};
		var pub = {
			init: priv.init
		};
		return pub;
	});

