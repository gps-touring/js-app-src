define(["leaflet", "leafletAwesomeMarkers", "leaflet.markercluster"], function(leaflet, awesomeMarkers, cluster) {
	"use strict";

	var group = null;

	function Marker(map, latlng, options, eventHandlers) {

		// Using font-awesome icons, the available choices can be seen here:
		// http://fortawesome.github.io/Font-Awesome/icons/
		var dfltOptions = {prefix: "fa"};	// "fa" selects the font-awesome icon set (we have no other)

		// options argument overrides our default options:
		var opts = Object.assign(dfltOptions, options);
		var i;
		var redMarker = leaflet.AwesomeMarkers.icon(opts);
		this.map = map;
		//this.marker = leaflet.marker(latlng, {icon: redMarker}).addTo(map);
		this.marker = leaflet.marker(latlng, {icon: redMarker});
		// Add the event handlers that are defined in model/pointseq:
		var evs = Object.keys(eventHandlers);
		for (i = 0; i < evs.length; ++i) {
			this.marker.on(evs[i], eventHandlers[evs[i]]);
		}
		if (group === null) {
			group = leaflet.markerClusterGroup();
			map.addLayer(group);
		}
		group.addLayer(this.marker);
	}
	Marker.prototype.destroy = function() {
		this.map.removeLayer(this.marker);
	};

	var pub = {
		Marker: Marker
	};
	return pub;
});

