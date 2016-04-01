define(
	["leaflet"],
	function(leaflet) {
		"use strict";

		var priv = {
			init: function() {
				var mymap = leaflet.map('map', {
					center: [51.505, -0.09],
					zoom: 13
				});
				L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
					maxZoom: 18,
					//id: 'your.mapbox.project.id',
					//accessToken: 'your.mapbox.public.access.token'
				}).addTo(mymap);
			}
		};
		var pub = {
			init: priv.init
		};
		return pub;
	});


