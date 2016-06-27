define(["leaflet"], function(leaflet) {
	"use strict";

	var keepCurrentView = false; 	// because it is initally set to by the system, not the user.

	function PointSeq(map, latlngs, eventHandlers) {

		this.polyline = leaflet.polyline(latlngs, {className: "route"}).addTo(map);
		var bounds = this.polyline.getBounds();
		var i;
		// Add the event handlers that are defined in model/pointseq:
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
	PointSeq.prototype.showState = function(state) {
		// state is an Object whose keys are CSS class names, and whose values are boolean.
		// e.g. {selected: true, hovered: false}

		// The path.setStyle({className approach is fundamentally broken!
		// See https://github.com/Leaflet/Leaflet/issues/2662
		// An alternative approach (hack) is to use the non-API _path property to manipulate the DOM directly:
		var i, keys = Object.keys(state);
		for (i = 0; i < keys.length; ++i) {
			if (state[keys[i]] && !leaflet.DomUtil.hasClass(this.polyline._path, keys[i])) {
				leaflet.DomUtil.addClass(this.polyline._path, keys[i]);
			}
			if (!state[keys[i]] && leaflet.DomUtil.hasClass(this.polyline._path, keys[i])) {
				leaflet.DomUtil.removeClass(this.polyline._path, keys[i]);
			}
		}
	};
	PointSeq.prototype.setVisibility = function(vis) {	// vis is boolean
		var cssClass = "hidden";
		if (vis && leaflet.DomUtil.hasClass(this.polyline._path, cssClass)) {
			leaflet.DomUtil.removeClass(this.polyline._path, cssClass);
		}
		if (!vis && !leaflet.DomUtil.hasClass(this.polyline._path, cssClass)) {
			leaflet.DomUtil.addClass(this.polyline._path, cssClass);
		}
	};

	var pub = {
		PointSeq: PointSeq
	};
	return pub;
});

