define(["leaflet", "app/eventbus"], function(leaflet, eventbus) {
	"use strict";

	// See
	// http://leafletjs.com/reference.html#events
	// http://leafletjs.com/reference.html#event-objects
	// http://leafletjs.com/reference.html#path - the Event types are defined here.
	var eventHandlers = {
		// We need to keep the reference to each waypintSequence (in the model)
		// within (as a closure) each event handler we create:
		click: function(pointseq) {
			return function(e) {
				console.log("PointSeq click: " + e.latlng);
				// Tell the model to do something:
				pointseq.setSelected(true);
			};
		},
		mouseover: function(pointseq) {
			return function(e) {
				//console.log("PointSeq mouseover: " + e.latlng);
				// Tell the model to do something:
				pointseq.setHovered(true);
			};
		},
		mouseout: function(pointseq) {
			return function(e) {
				//console.log("PointSeq mouseout: " + e.latlng);
				// Tell the model to do something:
				pointseq.setHovered(false);
			};
		}
	};
	function createEventHandlers(pointseq) {
		var res = {};
		var i, keys = Object.keys(eventHandlers);
		for (i = 0; i < keys.length; ++i) {
			res[keys[i]] = eventHandlers[keys[i]](pointseq);
		}
		return res;
	}
	function toLeafletLatLngs(seq) {
		var j, latLngs = [];
		for (j = 0; j < seq.length; ++j) {
			latLngs.push(leaflet.latLng(seq.points[j].lat, seq.points[j].lng));
		}
		return latLngs;
	}
	function getMarkers(seq) {
		// create markers for all ponts in the sequence that have information worth marking
		// (i.e. more than just lat, lng and ele)
		var markers = [];
		var marker = null;
		seq.points.forEach(function(p) {
			marker = {};
			if (!p.isJustLocation()) {
				marker.hovertext = p.toHoverText();
			}
			if (Object.keys(marker).length > 0) {
				marker.latlng = [p.lat, p.lng];
				markers.push(marker);
			}
		});
		return markers;
	}
	var pub = {
		createEventHandlers: createEventHandlers,
		toLeafletLatLngs: toLeafletLatLngs,
		getMarkers: getMarkers
	};
	return pub;
});

