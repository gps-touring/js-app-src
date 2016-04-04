define([], function() {
	"use strict";
	var parseStr = function(xmlStr, xmlSpec) {
		console.log("xmlParse.parseStr");
		var oParser = new DOMParser();
		var oDOM = oParser.parseFromString(xmlStr, "application/xml");
		var rootSpec = null;
		//var oDOM = oParser.parseFromString(str, "text/xml");
		// print the name of the root element or error message
		if (oDOM.documentElement.nodeName == "parsererror") {
			console.log("error while parsing application/xml");
			// TODO error reporting.
		}
		else {
			// Check that the root element is one of those specified in xmlSpec.root
			// (usually there will be just one specified there):
			rootSpec = xmlSpec.root[oDOM.documentElement.nodeName];
			if (!rootSpec) {
				colsole.log("Unexpected root element: " + dDOM.documentElement.nodeName);
			}
			else {
				//var root = {};
				//return parseElementOld(oDOM.documentElement, xmlSpec, xmlSpec.root.type, null);
				return parseElement(oDOM.documentElement, xmlSpec, rootSpec, {});
			}
		}
	};

	var STRING = 1;
	var DATETIME = 2;
	var textParser = {};
	textParser[STRING] = function(doc) {
		return doc.firstChild.wholeText.toString();
	};
	textParser[DATETIME] = function(doc) {
		return doc.firstChild.wholeText.toString();
	};
	var parseString = function(doc, res) {
		res[doc.nodeName] = doc.firstChild.wholeText.toString();
		return res;
	};
	var parseElement = function(doc, xmlSpec, elementSpec, parent) {
		var res;
		var attrs = elementSpec.attrs ? parseAttributes(doc, elementSpec.attrs) : null;
		var childElements = xmlSpec[elementSpec.type] ? parseType(doc, xmlSpec, elementSpec.type) : null;
		var text = textParser[elementSpec.type] ? textParser[elementSpec.type](doc) : null;
		//console.log("Attributes of " + doc.nodeName + ":");
		//console.log(attrs);
		if (text !== null) {
			res = text;
		}
		else if (attrs || childElements) {
			res = Object.assign(attrs || {}, childElements || {});
		}
		else {
			console.log("No spec found for " + elementSpec.type);
		}
		return res;
	};
	var parseAttributes = function(doc, specAttrs) {
		// returns an object {name: value, ...}, including only those names in the spec.
		var i = 0;
		var attrs = doc.attributes;
		var res = {};
		var name;
		for (i = 0; i < attrs.length; ++i) {
			name = attrs.item(i).name;
			console.log(name);
			console.log(attrs.item(i).value);
			if (specAttrs[name]) {
				// This attribute is specified in the xmlSpec, so we'll preserve it:
				res[name] = attrs.item(i).value;
			}
			else {
				console.log("Attribute not found in spec, and so ignored: " + name);
			}
		}
		return res;
	}
	var parseType = function(doc, xmlSpec, type) {
		// returns an Object {tagname: [doc, ...], ...} including only those tagnames that appear as elements in the typeSpec.
		var typeSpec = xmlSpec[type];
		var res = {};
		var children = doc.childNodes;
		var i;
		var tagName, tags;
		for (i = 0; i < children.length; ++i) {
			//console.log(children[i].nodeName);
			//console.log(children[i].nodeValue);
			//console.log(children[i].nodeType);
			switch (children[i].nodeType) {
				case Node.ELEMENT_NODE:
					tagName = children[i].nodeName;
					if (typeSpec[tagName]) {
						if (!res[tagName]) {
							res[tagName] = [];
						}
						res[tagName].push(parseElement(children[i], xmlSpec, typeSpec[tagName], res));
					}
					else {
						console.log("Ignoring element not in xmlSpec: " + tagName);
					}
				break;
				case Node.TEXT_NODE:
					//ignore
					if (children[i].wholeText.toString().trim().length > 0) {
						console.log("TEXT_NODE: " + children[i].nodeValue + ", wholeText: " + children[i].wholeText);
					}

					break;
				default:
					console.log(children[i].nodeName + " is of type " + children[i].nodeType + " and therefore ignored.");
					break;
			}
		}
		// Convert arrays of values back into single strings, when max number of them is 1:
		tags = Object.keys(res);
		for (i = 0; i < tags.length; ++i) {
			if (typeSpec[tags[i]].max === 1) {
				res[tags[i]] = res[tags[i]][0];
			}
		}

		return res;
	};
	var pub = {
		parseStr: parseStr,
		STRING: STRING,
		DATETIME: DATETIME
	};
	return pub;
});
