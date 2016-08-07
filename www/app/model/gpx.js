define( ["util/xml", "app/eventbus", "model/gpxParse", "model/point", "model/pointseq"], function(xml, eventbus, gpxParse, point, pointseq) {
	"use strict";

	function convertGpxWaypointsToModelPoints(gpxWpts) {
		if (!gpxWpts) {
			return [];
		}
		return gpxWpts.map(function(e) {
			// We only want to pass the gpx wpt data (e) into the Point if there is more in it than just the
			// lat, lon, and (optionally) ele properties.
			// We assume that lat and lon are always there (else it's ill-defined GPX wpt).
			var len = Object.keys(e).length;
			var wptHasAdditionalInfo = len > 3 || (e.ele === undefined && len > 2);
			//if (wptHasAdditionalInfo) console.log(e);
			var gpxWpt = wptHasAdditionalInfo ? e : undefined;
			var pt = new point.Point(e.lat, e.lon, e.ele, {gpxWpt: gpxWpt});
			return pt;
		});
	}

	var modelObjects = [];

	function getDescForLinks(link) {
		// CAUTION - maybe unfinished, work in progress.
		//         - this was added as part of populating the <desc> of the <rte>
		return xml.xml("p", {}, "Links found in original GPX file:" +
					   link.map(function(lk) {
			return xml.xml("a", {href: lk.href}, 
						   (lk.text ? lk.text : " ") +
							   (lk.type ? lk.type : "")
						  );

		}).join(""));
	}
	function getDesc(gpxObject) {
		// CAUTION - maybe unfinished, work in progress.
		//         - this was added as part of populating the <desc> of the <rte>
		// gpxObject is a <rte> or a <trk>
		//console.log("gpx.getDesc: gpxObject.link");
		//console.log(gpxObject.link);
		return (gpxObject.name ? gpxObject.name : "") +
			(gpxObject.link ? getDescForLinks(gpxObject.link) : "") +
			"";
	}
	function getLinkHtml(link) {
		// CAUTION - maybe unfinished, work in progress.
		//         - this was added as part of populating the <desc> of the <rte>
		//return xml.xml("p", {}, "Links:");
		if (link) {
			if (Array.isArray(link)) {
				console.log("link isArray");
				return (xml.xml("p", {}, "Links:") +
						xml.xml("ul", {}, link.map(
							function(lk) {
								return xml.xml("li", {}, xml.xml("a", {href: lk.href}, (lk.text ? lk.text : " ") + (lk.type ? lk.type : "")));
							}).join("")
							   )
					   );
			}
			else {
				console.log("link NOT isArray");
				console.log(link);
				return xml.xml("p", {}, "link: " + xml.xml("a", {href: link.href}, (link.text ? link.text : " ") + (link.type ? link.type : "")));
			}
		}
		else {
			return "";
		}
	}
	function getAuthorHtml(author) {
		// CAUTION - maybe unfinished, work in progress.
		//         - this was added as part of populating the <desc> of the <rte>
		return author ? (xml.xml("h2", {}, "Author information:") + getNameHtml(author.name) + getLinkHtml(author.link)) : "";
	}
	function getNameHtml(name) {
		return name ? xml.xml("p", {}, "Name: " + name) : "";
	}
	function getTrkDesc(trk) {
		// CAUTION - maybe unfinished, work in progress.
		//         - this was added as part of populating the <desc> of the <rte>
		return trk ? (xml.xml("h2", {}, "Track information:") + getNameHtml(trk.name) + getLinkHtml(trk.link)) : "";
	}
	function getMetadataDesc(metadata) {
		// CAUTION - maybe unfinished, work in progress.
		//         - this was added as part of populating the <desc> of the <rte>
		return metadata ? (xml.xml("h2", {}, "Metadata information:") + getAuthorHtml(metadata.name) + getNameHtml(metadata.name) + getLinkHtml(metadata.link)) : "";
	}

	// Construct a Gpx object from a string:
	function Gpx(file, str) {
		var parsed = gpxParse.parseXmlStr(str);
		var pointSeqs = [];
		var waypoints = [];
		var ptSeq;
		var pts = null;
		var newpts = null;
		var desc = null;
		var name;
		if (parsed.trk) {
			parsed.trk.forEach( function(trk) {
				name = trk.name || file.name;
				//console.log(trk.name);
				// We want to merge <trkseg>s when the start of one trkseg matches the end of the previous trkseg.
				// This deals with some poorly considered GPX files in which every pair of points is put into its own trkseg
				// (silly, but I have seen examples) - this can mean thousands of PointSeq object which can overwhelm the UI.
				pts = [];	// Gather together points from consecutive trksegs (where next trkseg continues from preious trkseg)
				trk.trkseg.forEach( function(trkseg) {
					newpts = convertGpxWaypointsToModelPoints(trkseg.trkpt);
					if (newpts.length > 0) {
						if (pts.length == 0) {
							pts = newpts;
						}
						else if (pts[pts.length - 1].isSameLatLng(newpts[0])) {
							// newpts continue on from pts.
							// We leave the end of pts and the start of newpts in tact (even though they have the same lat an lng)
							// in case there's other info in the <wpt> that differs between these two points.
							// This duplication will be removed by PointSeq.simplify().
							Array.prototype.push.apply(pts, newpts);
						}
						else {
							// Both pts and newpts contain points, but newpts does not continue from the end of pts.
							// Save what's already stored in pts:
							// CAUTION - maybe unfinished, work in progress.
							//         - this was added as part of populating the <desc> of the <rte>
							desc = getMetadataDesc(parsed.metadata) + getTrkDesc(trk);
							//console.log(desc);
							pointSeqs.push(new pointseq.PointSeq(pointseq.typeEnum.gpx, file.name, name, desc, {points: pts}));
							// Start gathering another sequence, 
							pts = newpts;
						}
					}
					else {
						// Empty <trkseg> - nothing to do.
					}
				});
				// The last sequence of points from continuing trksegs still needs to be saved:
				if (pts.length > 0) {
					// CAUTION - maybe unfinished, work in progress.
					//         - this was added as part of populating the <desc> of the <rte>
					desc = getMetadataDesc(parsed.metadata) + getTrkDesc(trk);
					//console.log(desc);
					pointSeqs.push(new pointseq.PointSeq(pointseq.typeEnum.gpx, file.name, name, desc, {points: pts}));
				}
			});
		}
		if (parsed.rte) {
			parsed.rte.forEach( function(rte) {
				name = rte.name || file.name;
				// TODO - if we're adding <desc> (to be used when outputing GPX) for <trk> input, then 
				//      - we should do the same for this <rte> input.
				ptSeq = new pointseq.PointSeq(pointseq.typeEnum.gpx, file.name, name, getDesc(rte), {
					points: convertGpxWaypointsToModelPoints(rte.rtept)
				});
				pointSeqs.push(ptSeq);
			});
		}
		if (parsed.wpt) {
			waypoints = convertGpxWaypointsToModelPoints(parsed.wpt);
			eventbus.publish({
				topic: "Waypoints.add",
				data: {
					waypoints: waypoints,
					fileName: file.name
				}
			});
		}

		Object.defineProperties(this, {
			file: { value: file, enumerable: true},
			pointSeqs: { value: pointSeqs, enumerable: true},
			waypoints: { value: waypoints, enumerable: true}
		});
	}
	Gpx.prototype.simplifyPtSeqs = function() {
		// returtns array of PointSeqs
		return pointseq.createSimplified(this.pointSeqs);
	};
	var pub = {
		Gpx: Gpx
	};
	return pub;
});
