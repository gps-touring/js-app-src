define(
	["leaflet", "presenter/map"],
	function(leaflet, presenter) {
		"use strict";

		var settings;
		var mymap;
		var keepCurrentView = false; 	// because it is initally set to by the system, not the user.
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
		function showLatLngs(latlngs, eventHandlers, className) {
			var polyline = leaflet.polyline(latlngs, {className: className}).addTo(mymap);
			var bounds = polyline.getBounds();
			var i;
			// Add the event handlers that are defined in model/wptseq:
			var evs = Object.keys(eventHandlers);
			for (i = 0; i < evs.length; ++i) {
				polyline.on(evs[i], eventHandlers[evs[i]]);
			}
			// zoom the map to the polyline
			if (keepCurrentView) {
				bounds.extend(mymap.getBounds());
			}
			else {
				// Subsequent displays will keep what's already displayed in view.
				keepCurrentView = true;
			}
			mymap.fitBounds(bounds);
		}
		var pub = {
			init: priv.init,
			showLatLngs: showLatLngs
		};
		settings = presenter.registerView(pub);
		return pub;
	});
