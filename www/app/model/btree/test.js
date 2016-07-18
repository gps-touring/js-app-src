define(["model/btree"], function(btree) {
	"use strict";

	function test1() {
		console.log("btree/test/test1");
		var tree = new btree.BinarySearchTree(function(a, b) { return a > b; });
		tree.add(2);
		tree.add(20);
		tree.add(1);
		tree.add(12);
		tree.add(21);
		tree.add(27);
		tree.add(-1);
		tree.add(3);
		console.log(tree.toArray());
	}
	function test2() {
		console.log("btree/test/test2");
		function Xy(x, y) {
			this.x = x;
			this.y = y;
		}
		Xy.prototype.toString = function() {
			return "[" + this.x + ", " + this.y + "]";
		}
		var tree = new btree.BinarySearchTree(function(a, b) { return a.x < b.x || a.y < b.y; });
		tree.add(new Xy(1, 2));
		tree.add(new Xy(1, 1));
		tree.add(new Xy(1, 3));
		tree.add(new Xy(-1, 1));
		tree.add(new Xy(-1, -1));
		tree.add(new Xy(1, 1));
		console.log(tree.toString());
	}
	function test() {
		test1();
		test2();
	}
	var pub = {
		test: test
	};
	return pub;
});
