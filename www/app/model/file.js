define( ["model/userdata", "model/mouseStates", "app/eventbus"], function(userdata, mouseStates, eventbus) {
	"use strict";

	var eventPrefix = "File";
	var modelObjects = [];

	// What happens when a file is loaded?
	//  - the gpxObject contains the original GPX routes (<rte> and <trk>/<trkseg>) and waypoints (from <wpt>)
	//  - simplified versions of the routes are created
	//    - reduce precision (to 5dp) of lat/long
	//    - merge adjacent routes (usually from two <trkseg> where end of one is same as start of next)
	//    - remove unnecessary waypoints
	//    - more?
	var File = function(theSource, gpxObject) {
		Object.defineProperties(this, {
			source: { value: theSource, enumerable: true },
			gpxObject: { value: gpxObject, enumerable: true },
			simplifiedPtSeqs: { value: gpxObject.simplifyPtSeqs(theSource.name), enumerable: true },
			id: {value: modelObjects.length, enumerable: true },
			// userdata: property created if setUserData is called.
		});
		// mouseStates defines some properties (currently, 1 property, "selected") for our modelObject:
		Object.defineProperties(this, mouseStates.objectProperties);
		//console.log(this);
		modelObjects.push(this);
		eventbus.publish({topic: eventPrefix + ".new", data: {modelObject: this}});
	};
	// TODO -verify if userdata is needed for File obejcts.
	// define a userdata property for File if setUserData is called:
	File.prototype.setUserData = userdata.setUserData;
	File.prototype.getUserData = userdata.getUserData;

	// mouseStates will create functions for this module, which are configured
	// by parameters for use by this module:
	File.prototype.setSelected = mouseStates.setSelected(eventPrefix, modelObjects);
	File.prototype.clearSelections = mouseStates.clearSelections(modelObjects);
	File.prototype.setHovered = mouseStates.setHovered(eventPrefix);

	File.prototype.getSourceName = function() {
		return this.source.name;
	};
	function getAll() {
		return modelObjects;
	}

	var pub = {
		getAll: getAll,
		File: File
	};
	return pub;
});


