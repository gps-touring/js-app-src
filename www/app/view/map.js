define(
	["leaflet", "leaflet.contextmenu", "presenter/map", "view/map/wptseq", "view/map/marker"],
	function(leaflet, contextmenu, presenter, wptseqView, markerView) {
		"use strict";

		var settings;
		var map;
		var priv = {
			init: function() {
				var i, eventHandlers = presenter.getMapEventHandlers();
				var k = Object.keys(eventHandlers);
				// For the contextmenu docs, see https://github.com/aratcliffe/Leaflet.contextmenu.
				map = leaflet.map("map", {
					contextmenu: true,
					contextmenuWidth: 140,
					contextmenuItems: presenter.getContextmenuItems(),
					center: [51.505, -0.09],
					zoom: 13
				});

				for (i = 0; i < k.length; ++i) {
					map.on(k[i], eventHandlers[k[i]]);
				}

				leaflet.tileLayer("http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png", {
					attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>",
					maxZoom: 18
				}).addTo(map);
			}
		};
		function addWaypointSequence(latlngs, eventHandlers, className) {
			return new wptseqView.WaypointSequence(map, latlngs, eventHandlers, className);
		}
		function addMarker(latlng, options, eventHandlers) {
			return new markerView.Marker(map, latlng, options, eventHandlers);
		}
		var pub = {
			init: priv.init,
			addWaypointSequence: addWaypointSequence,
			addMarker: addMarker
		};
		settings = presenter.registerView(pub);
		return pub;
	});
