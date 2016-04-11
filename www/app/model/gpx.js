define(
	["model/gpxParse"],
	function(gpxParse) {
		"use strict";
		var priv = {
			parseGpxStr: function(str) {
				gpxParse.parseXmlStr(str);
			}
		};
		var pub = {
			parseGpxStr: priv.parseGpxStr
		};
		return pub;
	});
