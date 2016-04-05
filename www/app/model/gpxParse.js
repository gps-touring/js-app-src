define(["model/xmlParse"], function(xmlParse) {
	"use strict";
	var xmlSpec = {
		// This spec is derived from http://www.topografix.com/GPX/1/1/
		// TODO - validation based on specs at the above URL. e.g. ranges of validity.
		// TODO - it feels like attrs are specified in the wrong place - they should be with their types.
		//        e.g. specify the attributes of <gpx> with the gpxType.
		root: {
			gpx: { attrs: { xmlns: {}, version: {}, creator: {} }, type: "gpxType", min: 1, max: 1 }
		},
		gpxType: {
			metadata: {min: 0, max: 1, type: "metadataType"},
			wpt: {attrs: {lat: {}, lon: {} }, type: "wptType", min: 0, max: undefined},
			rte: {type: "rteType", min: 0, max: undefined},
			trk: {type: "trkType", min: 0, max: undefined}
		},
		metadataType: {
			name: {type: xmlParse.STRING, min: 0, max: 1},
			desc: {type: xmlParse.STRING, min: 0, max: 1},
			author: {type: "personType", min: 0, max: 1},
			copyright: {attrs: {author: {} }, type: "copyrightType", min: 0, max: 1},
			link: {attrs: {href: {}}, type: "linkType", min: 0, max: undefined},
			time: {type: xmlParse.DATETIME, min: 0, max: 1},
			keywords: {type: xmlParse.STRING, min: 0, max: 1},
			bounds: {attrs: {minlat: {}, minlon: {}, maxlat: {}, maxlon: {} }, type: "boundsType", min: 0, max: 1},
			extensions: {type: "extensionsType", min: 0, max: 1}
		},
		wptType: {
			ele: {type: xmlParse.DECIMAL, min: 0, max: 1},
			time: {type: xmlParse.DATETIME, min: 0, max: 1},
			magvar: {type: xmlParse.DECIMAL, min: 0, max: 1},
			geoidheight: {type: xmlParse.DECIMAL, min: 0, max: 1},
			name: {type: xmlParse.STRING, min: 0, max: 1},
			cmt: {type: xmlParse.STRING, min: 0, max: 1},
			desc: {type: xmlParse.STRING, min: 0, max: 1},
			src: {type: xmlParse.STRING, min: 0, max: 1},
			link: {attrs: {href: {}}, type: "linkType", min: 0, max: undefined},
			sym: {type: xmlParse.STRING, min: 0, max: 1},
			type: {type: xmlParse.STRING, min: 0, max: 1},
			//fix: {type: "fixType", min: 0, max: 1},
			fix: {type: xmlParse.STRING, min: 0, max: 1},
			sat: {type: xmlParse.NONNEGATIVEINTEGER, min: 0, max: 1},
			hdop: {type: xmlParse.DECIMAL, min: 0, max: 1},
			vdop: {type: xmlParse.DECIMAL, min: 0, max: 1},
			pdop: {type: xmlParse.DECIMAL, min: 0, max: 1},
			ageofdgpsdata: {type: xmlParse.DECIMAL, min: 0, max: 1},
			//dgpsid: {type: "dgpsStationType", min: 0, max: 1},
			dgpsid: {type: xmlParse.INTEGER, min: 0, max: 1},
			extensions: {type: "extensionsType", min: 0, max: 1}
		},
		rteType: {
			name: {type: xmlParse.STRING, min: 0, max: 1},
			cmt: {type: xmlParse.STRING, min: 0, max: 1},
			desc: {type: xmlParse.STRING, min: 0, max: 1},
			src: {type: xmlParse.STRING, min: 0, max: 1},
			link: {attrs: {href: {}}, type: "linkType", min: 0, max: undefined},
			number: {type: xmlParse.NONNEGATIVEINTEGER, min: 0, max: 1},
			type: {type: xmlParse.STRING, min: 0, max: 1},
			extensions: {type: "extensionsType", min: 0, max: 1},
			rtept: {attrs: {lat: {}, lon: {} }, type: "wptType", min: 0, max: undefined}
		},
		trkType: {
			name: {type: xmlParse.STRING, min: 0, max: 1},
			cmt: {type: xmlParse.STRING, min: 0, max: 1},
			desc: {type: xmlParse.STRING, min: 0, max: 1},
			src: {type: xmlParse.STRING, min: 0, max: 1},
			link: {attrs: {href: {}}, type: "linkType", min: 0, max: undefined},
			number: {type: xmlParse.NONNEGATIVEINTEGER, min: 0, max: 1},
			type: {type: xmlParse.STRING, min: 0, max: 1},
			extensions: {type: "extensionsType", min: 0, max: 1},
			trkseg: {type: "trksegType", min: 0, max: undefined}
		},
		trksegType: {
			trkpt: {attrs: {lat: {}, lon: {} }, type: "wptType", min: 0, max: undefined},
			extensions: {type: "extensionsType", min: 0, max: 1}
		},
		copyrightType: {
			year: {type: xmlParse.GYEAR, min: 0, max: 1},
			license: {type: xmlParse.ANYURI, min: 0, max: 1},
		},
		linkType: {
			text: {type: xmlParse.STRING, min: 0, max: 1},
			type: {type: xmlParse.STRING, min: 0, max: 1}
		},
		emailType: {
		},
		personType: {
			name: {type: xmlParse.STRING, min: 0, max: 1},
			email: {attrs: {id: {}, domain: {} }, type: "emailType", min: 0, max: 1},
			link: {attrs: {href: {}}, type: "linkType", min: 0, max: 1}
		},
		ptType: {
			ele: {type: xmlParse.DECIMAL, min: 0, max: 1},
			time: {type: xmlParse.DATETIME, min: 0, max: 1}
		},
		ptsegType: {
			pt: {attrs: {lat: {}, lon: {} }, type: "ptType", min: 0, max: undefined}
		},
		boundsType: {
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
