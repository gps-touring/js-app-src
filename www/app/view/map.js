define(
	["leaflet", "presenter/map", "view/map/wptseq"],
	function(leaflet, presenter, wptseqView) {
		"use strict";

		var settings;
		var mymap;
		var priv = {
			init: function() {
				mymap = leaflet.map("map", {
					center: [51.505, -0.09],
					zoom: 13
				});
				leaflet.tileLayer("http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png", {
					attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>",
					maxZoom: 18
				}).addTo(mymap);
			}
		};
		function addWaypointSequence(latlngs, eventHandlers, className) {
			return new wptseqView.WaypointSequence(mymap, latlngs, eventHandlers, className);
		}
		var pub = {
			init: priv.init,
			addWaypointSequence: addWaypointSequence
		};
		settings = presenter.registerView(pub);
		return pub;
	});
