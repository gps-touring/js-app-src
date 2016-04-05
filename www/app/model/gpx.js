define(
	["model/gpxParse", "gpxParse"],
	function(gpxParse, gpxParseLib) {
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
