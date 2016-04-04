define(["model/xmlParse"], function(xmlParse) {
	"use strict";
	var xmlSpec = {
		root: {
			gpx: {
				attrs: {
					version: {},
					creator: {}
				},
				type: "gpxType",
				min: 1, max: 1
			}
		},
		gpxType: {
			metadata: {min: 0, max: 1, type: "metadataType"}
		},
		metadataType: {
			name: {type: xmlParse.STRING, min: 0, max: 1},
			desc: {type: xmlParse.STRING, min: 0, max: 1},
			author: {type: "personType", min: 0, max: 1},
			copyright: {type: "copyrightType", min: 0, max: 1},
			link: {attrs: {href: {}}, type: "linkType", min: 0, max: undefined},
			time: {type: xmlParse.DATETIME, min: 0, max: 1},
			keywords: {type: xmlParse.STRING, min: 0, max: 1},
			bounds: {type: "boundsType", min: 0, max: 1},
			extensions: {type: "extensionsType", min: 0, max: 1}
		},
		linkType: {
			text: {type: xmlParse.STRING, min: 0, max: 1},
			type: {type: xmlParse.STRING, min: 0, max: 1},
		}

	};
	var parseXmlStr = function(str) {
		var res = xmlParse.parseStr(str, xmlSpec)
		console.log(res);
	};
	var pub = {
		parseXmlStr: parseXmlStr
	};
	return pub;
});
