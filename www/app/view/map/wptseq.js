define(["leaflet"], function(leaflet) {
	"use strict";

	var keepCurrentView = false; 	// because it is initally set to by the system, not the user.

	function WaypointSequence(map, latlngs, eventHandlers) {

		this.polyline = leaflet.polyline(latlngs, {className: "route"}).addTo(map);
		var bounds = this.polyline.getBounds();
		var i;
		// Add the event handlers that are defined in model/wptseq:
		var evs = Object.keys(eventHandlers);
		for (i = 0; i < evs.length; ++i) {
			this.polyline.on(evs[i], eventHandlers[evs[i]]);
		}
		// zoom the map to the polyline
		if (keepCurrentView) {
			bounds.extend(map.getBounds());
		}
		else {
			// Subsequent displays will keep what's already displayed in view.
			keepCurrentView = true;
		}
		map.fitBounds(bounds);
	}
	WaypointSequence.prototype.showHovered = function(isIt) {
		// The path.setStyle({className approach is fundamentally broken!
		// See https://github.com/Leaflet/Leaflet/issues/2662
		// An alternative approach (hack) is to use the non-API _path property to manipulate the DOM directly:
		leaflet.DomUtil.removeClass(this.polyline._path, "route");
		leaflet.DomUtil.removeClass(this.polyline._path, "route-hovered");
		leaflet.DomUtil.addClass(this.polyline._path, isIt ? "route-hovered" : "route");
	};

	var pub = {
		WaypointSequence: WaypointSequence
	};
	return pub;
});

