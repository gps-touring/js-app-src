define(["model/xmlParse"], function(xmlParse) {
	"use strict";
	var xmlSpec = {
		// This spec is derived from http://www.topografix.com/GPX/1/1/
		// TODO - validation based on specs at the above URL. e.g. ranges of validity.
		// TODO - it feels like attrs are specified in the wrong place - they should be with their types.
		//        e.g. specify the attributes of <gpx> with the gpxType.
		root: {
			gpx: { type: "gpxType", min: 1, max: 1 }
		},
		gpxType: {
			attrs: { xmlns: {}, version: {}, creator: {} },
			elements: {
				metadata: {min: 0, max: 1, type: "metadataType"},
				wpt: {type: "wptType", min: 0, max: undefined},
				rte: {type: "rteType", min: 0, max: undefined},
				trk: {type: "trkType", min: 0, max: undefined}
			}
		},
		metadataType: {
			elements: {
				name: {type: xmlParse.STRING, min: 0, max: 1},
				desc: {type: xmlParse.STRING, min: 0, max: 1},
				author: {type: "personType", min: 0, max: 1},
				copyright: {type: "copyrightType", min: 0, max: 1},
				link: {type: "linkType", min: 0, max: undefined},
				time: {type: xmlParse.DATETIME, min: 0, max: 1},
				keywords: {type: xmlParse.STRING, min: 0, max: 1},
				bounds: {type: "boundsType", min: 0, max: 1},
				extensions: {type: "extensionsType", min: 0, max: 1}
			}
		},
		wptType: {
			attrs: {
				lat: {type: "latitudeType"},
				lon: {}
			}, 
			elements: {
				ele: {type: xmlParse.DECIMAL, min: 0, max: 1},
				time: {type: xmlParse.DATETIME, min: 0, max: 1},
				magvar: {type: "degreesType", min: 0, max: 1},
				geoidheight: {type: xmlParse.DECIMAL, min: 0, max: 1},
				name: {type: xmlParse.STRING, min: 0, max: 1},
				cmt: {type: xmlParse.STRING, min: 0, max: 1},
				desc: {type: xmlParse.STRING, min: 0, max: 1},
				src: {type: xmlParse.STRING, min: 0, max: 1},
				link: {type: "linkType", min: 0, max: undefined},
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
			}
		},
		rteType: {
			elements: {
				name: {type: xmlParse.STRING, min: 0, max: 1},
				cmt: {type: xmlParse.STRING, min: 0, max: 1},
				desc: {type: xmlParse.STRING, min: 0, max: 1},
				src: {type: xmlParse.STRING, min: 0, max: 1},
				link: {type: "linkType", min: 0, max: undefined},
				number: {type: xmlParse.NONNEGATIVEINTEGER, min: 0, max: 1},
				type: {type: xmlParse.STRING, min: 0, max: 1},
				extensions: {type: "extensionsType", min: 0, max: 1},
				rtept: {type: "wptType", min: 0, max: undefined}
			}
		},
		trkType: {
			elements: {
				name: {type: xmlParse.STRING, min: 0, max: 1},
				cmt: {type: xmlParse.STRING, min: 0, max: 1},
				desc: {type: xmlParse.STRING, min: 0, max: 1},
				src: {type: xmlParse.STRING, min: 0, max: 1},
				link: {type: "linkType", min: 0, max: undefined},
				number: {type: xmlParse.NONNEGATIVEINTEGER, min: 0, max: 1},
				type: {type: xmlParse.STRING, min: 0, max: 1},
				extensions: {type: "extensionsType", min: 0, max: 1},
				trkseg: {type: "trksegType", min: 0, max: undefined}
			}
		},
		trksegType: {
			elements: {
				trkpt: {type: "wptType", min: 0, max: undefined},
				extensions: {type: "extensionsType", min: 0, max: 1}
			}
		},
		latitudeType: {
			type: xmlParse.DECIMAL
		},
		degreesType: {
			type: xmlParse.DECIMAL
		},
		copyrightType: {
			attrs: {
				author: {}
			}, 
			elements: {
				year: {type: xmlParse.GYEAR, min: 0, max: 1},
				license: {type: xmlParse.ANYURI, min: 0, max: 1},
			}
		},
		linkType: {
			attrs: {
				href: {}
			},
			elements: {
				text: {type: xmlParse.STRING, min: 0, max: 1},
				type: {type: xmlParse.STRING, min: 0, max: 1}
			}
		},
		emailType: {
			attrs: {
				id: {},
				domain: {}
			} 
		},
		personType: {
			elements: {
				name: {type: xmlParse.STRING, min: 0, max: 1},
				email: {type: "emailType", min: 0, max: 1},
				link: {type: "linkType", min: 0, max: 1}
			}
		},
		ptType: {
			attrs: {
				lat: {},
				lon: {}
			}, 
			elements: {
				ele: {type: xmlParse.DECIMAL, min: 0, max: 1},
				time: {type: xmlParse.DATETIME, min: 0, max: 1}
			}
		},
		ptsegType: {
			elements: {
				pt: {type: "ptType", min: 0, max: undefined}
			}
		},
		boundsType: {
			attrs: {
				minlat: {},
				minlon: {},
				maxlat: {},
				maxlon: {}
			} 
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
