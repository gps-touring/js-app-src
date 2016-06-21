define( ["model/point", "model/vector2"], function(point, vector2) {
	"use strict";


	// A LineSeg is a line segment - between 2 points.
	function LineSeg(begin, end) {
		Object.defineProperties(this, {
			begin: { value: begin, enumerable: true },
			end: { value: end, enumerable: true }
		});
	}
	LineSeg.prototype.distanceTo = function(pt) {
		var v = new vector2.Vector2(this.begin);
		var w = new vector2.Vector2(this.end);
		var p = new vector2.Vector2(pt);
		var l2 = vector2.lengthSquared(v, w)	// i.e. |w-v|^2 -  avoid a sqrt
		var t;
		var nearest;
		if (l2 == 0.0) {	// i.e. begin == end
			nearest = this.begin;
		}
		else {
			// Consider the line extending the segment, parameterized as v + t (w - v).
			// We find the nearest point on the eline segment to point pt.
			// It falls where t = [(p-v) . (w-v)] / |w-v|^2
			t = vector2.dotProduct(p.minus(v), w.minus(v)) / l2;
			if (t <= 0.0) {
				nearest = this.begin;	// Beyond the 'v' end of the segment
			}
			else if (t >= 1.0) {
				nearest = this.end;	// Beyond the 'w' end of the segment
			}
			else {
				nearest = (v.plus(w.minus(v).times(t))).asPoint();
			}
		}
		return pt.distanceTo(nearest);
	};

	var pub = {
		LineSeg: LineSeg
	};
	return pub;
});
