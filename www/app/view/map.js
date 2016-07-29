define(
	["leaflet", "leaflet.contextmenu", "presenter/map", "view/map/pointseq", "view/map/marker"],
	function(leaflet, contextmenu, presenter, pointseqView, markerView) {
		"use strict";

		var settings;
		var map;
		var globalMarkerCluster;	// TODO - check if this is obsolete, once markers for POIs and polylines have been refactored.
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

				globalMarkerCluster = leaflet.markerClusterGroup();
				map.addLayer(globalMarkerCluster);
				markerView.init(map);
			}
		};
		function addPointSeq(latlngs, markers, eventHandlers, className) {
			return new pointseqView.PointSeq(map, latlngs, markers, eventHandlers, className);
		}
		function addMarker(latlng, options, eventHandlers) {
			return new markerView.Marker(map, globalMarkerCluster, latlng, options, eventHandlers);
		}
		var pub = {
			init: priv.init,
			addPointSeq: addPointSeq,
			addMarker: addMarker
		};
		settings = presenter.registerView(pub);
		return pub;
	});
