define(["leaflet", "leafletAwesomeMarkers"], function(leaflet, awesomeMarkers) {
	"use strict";

	function Marker(map, latlng, options, eventHandlers) {

		// Using font-awesome icons, the available choices can be seen here:
		// http://fortawesome.github.io/Font-Awesome/icons/
		var dfltOptions = {prefix: "fa"};	// "fa" selects the font-awesome icon set (we have no other)

		// options argument overrides our default options:
		var opts = Object.assign(dfltOptions, options);
		var i;
		var redMarker = leaflet.AwesomeMarkers.icon(opts);
		this.map = map;
		this.marker = leaflet.marker(latlng, {icon: redMarker}).addTo(map);
		// Add the event handlers that are defined in model/pointseq:
		var evs = Object.keys(eventHandlers);
		for (i = 0; i < evs.length; ++i) {
			this.marker.on(evs[i], eventHandlers[evs[i]]);
		}
	}
	Marker.prototype.destroy = function() {
		this.map.removeLayer(this.marker);
	};

	var pub = {
		Marker: Marker
	};
	return pub;
});

