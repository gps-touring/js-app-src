define(
	["model/gpxParse", "gpxParse"],
	function(gpxParse, gpxParseLib) {
		"use strict";
		var spec = {
			root: {
				gpx: {min: 1, max: 1}
			},
			gpx: {
				wpt: {min: 0, max: undefined },
				rte: {min: 0, max: undefined },
				trk: {min: 0, max: undefined },
				extensions: {min: 0, max: 1 },
				metadata: {min: 0, max: 1 }
			}
		};

		var priv = {
			parseGpxStr: function(str) {
				console.log("gpx.parseGpxStr()");
				gpxParse.parseXmlStr(str);
			},
			parseGpxStrUsingGpxParseLib: function(str) {
				console.log("gpx.parseGpxStrUsingGpxParseLib()");
				gpxParseLib.parseGpx(str, function(error, data) {
					if (error !== null) {
						alert("Error parsing GPX.");
						console.log(error);
					}
					else {
						console.log(data);
						console.log(data.waypoints);
						console.log(data.tracks);
						console.log(data.tracks[0].segments[0]);
						console.log(data.tracks[0].segments[0][0]);
						console.log(data.tracks[0].segment);
						lat, lon, elevation, time, magvar, geoidheight, name, cmt, desc, src, links, sym, type
						console.log(data.routes);
					}
				});
				
			},
			parseGpxStrUsingDomParser: function(str) {
				console.log("gpx.parseGpxStrUsingDomParser()");

				// Experimenting with using DOMParser to parse XML.
				// Investigate https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker
				//
				// TODO - investigate gpx-parse: http://www.vapidspace.com/gpx-parse/doc/index.html
				var oParser = new DOMParser();
				var oDOM = oParser.parseFromString(str, "application/xml");
				//var oDOM = oParser.parseFromString(str, "text/xml");
				// print the name of the root element or error message
				if (oDOM.documentElement.nodeName == "parsererror") {
					console.log("error while parsing tex/xml");
				}
				else {
					var gpx = {};
					priv.parseNode(oDOM.documentElement, spec.root, gpx);
					/*
					console.log(gpx);
					console.log(oDOM.documentElement.nodeName);
					var x = oDOM.documentElement.childNodes;
					var i = 0;
					for (i = 0; i < x.length ;i++) {
						//console.log(x[i].nodeName);
						console.log(x[i].nodeName + ": " + x[i].nodeValue);
					}
					*/
				}
			},
			parseNode: function(doc, sp, res) {
				console.log("FOO");
				console.log("parseNode. name: " + doc.nodeName + ", type: " + doc.nodeType);
				var nodeName = doc.nodeName;
				if (sp[nodeName] !== undefined) {
				   if(spec[nodeName] !== undefined) {
					   var x = doc.childNodes;
					   var i = 0;
					   for (i = 0; i < x.length ;i++) {
						   priv.parseNode(x[i], spec[nodeName], res);
					   }
				   }
				   else {
					   console.log("There is no spec for " + nodeName);
				   }
				}
				else {
					console.log("Unexpected node: " + nodeName);
				}
				//console.log("Xdoc: " + doc.nodeName);
				//console.log("Xsp: " + sp);
				//console.log("Xsp[]: " + sp[doc.nodeName].min);


			}
		};
		var pub = {
			parseGpxStr: priv.parseGpxStr,
			parseGpxStrUsingGpxParseLib: priv.parseGpxStrUsingGpxParseLib,
			parseGpxStrUsingDomParser: priv.parseGpxStrUsingDomParser
		};
		return pub;
	});
