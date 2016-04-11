define(
	["leaflet", "presenter/map"],
	function(leaflet, presenter) {
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
		function showLatLngs(latlngs) {
			var polyline = leaflet.polyline(latlngs, {color: "red"}).addTo(mymap);
			// zoom the map to the polyline
			mymap.fitBounds(polyline.getBounds());
		}
		var pub = {
			init: priv.init,
			showLatLngs: showLatLngs
		};
		settings = presenter.registerView(pub);
		return pub;
	});
