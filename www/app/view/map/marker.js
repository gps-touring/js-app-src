define(["leaflet", "leafletAwesomeMarkers", "leaflet.markercluster"], function(leaflet, awesomeMarkers, cluster) {
	"use strict";

	//var group = null;

	// Using font-awesome icons, the available choices can be seen here:
	// http://fortawesome.github.io/Font-Awesome/icons/
	var dfltOptions = {prefix: "fa"};	// "fa" selects the font-awesome icon set (we have no other)

	function init(map) {
		console.log("TODO 1. change the Marker constructor so that is takes a parent instead of both map and group");
		console.log("     2. then change the calling functions appropriately");
	}

	function Marker(map, group, latlng, options, eventHandlers) {
		

		var popuptext = "Popup text goes here <a href=\"http://www.google.co.uk\" target=\"_blank\">Google?</a>.";
		 
		var hovertext = options.hovertext || "Hover text goes here.";

		// options argument overrides our default options:
		var opts = Object.assign(dfltOptions, options);
		var icon = leaflet.AwesomeMarkers.icon(opts);
		this.marker = leaflet.marker(latlng, {icon: icon, title: hovertext});
		this.marker.bindPopup(popuptext);

		// Add the event handlers that are defined in presenter/map:
		Object.keys(eventHandlers).forEach(function(k) {
			this.marker.on(k, eventHandlers[k]);
		}, this);

		this.parent = options.cluster ? group : map;
		this.parent.addLayer(this.marker);
	}
	Marker.prototype.destroy = function() {
		this.parent.removeLayer(this.marker);
	};

	var pub = {
		init: init,
		Marker: Marker
	};
	return pub;
});

