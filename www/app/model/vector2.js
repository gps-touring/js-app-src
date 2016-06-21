define( ["model/point"], function(point) {
	"use strict";

	// Treats a LatLng Point as a 2D point in cartesian space.
	// This approximation is fine when dealing with points i
	//     that are close together, 
	//     and are not near the poles, 
	//     nor the anti-meridian (longitude = 180 degrees)
	// YOU HAVE BEEN WARNED!
	function Vector2(a) {	// a is 2 element array: [lng, lat] or Object {lat: ?, lng: ?}
		var x, y;
		if (Array.isArray(a)) {
			x = a[0];
			y = a[1];
		}
		else {
			x = a.lng;
			y = a.lat;
		}
		Object.defineProperties(this, {
			x: { value: Number(x), enumerable: true },
			y: { value: Number(y), enumerable: true }
		});
	}
	Vector2.prototype.asPoint = function() {
		return new point.Point(this.y, this.x);
	};
	Vector2.prototype.minus = function(v) {
		return new Vector2([this.x - v.x, this.y - v.y]);
	};
	Vector2.prototype.plus = function(v) {
		return new Vector2([this.x + v.x, this.y + v.y]);
	};
	Vector2.prototype.times = function(n) {
		return new Vector2([this.x * n, this.y * n]);
	};
	function lengthSquared(v, w) {
		return (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y)
	}
	function dotProduct(v, w) {
		return v.x * w.x + v.y * w.y
	}

	var pub = {
		Vector2: Vector2,
		lengthSquared: lengthSquared,
		dotProduct: dotProduct
	};
	return pub;
});
