"use strict";
var matches = require("dom-matches");
var parseDimension = require("parse-css-dimension");
var xtend = require("xtend");
var camelToSnake = require("camel-to-snake");

var NUMBERS_FIELDS = [
	"width", "height",
	"minWidth", "minHeight",
	"left", "right", "top", "bottom",
	"margin", "marginLeft", "marginRight", "marginTop", "marginBottom",
	"padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
	"borderWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth",
	"flex"
];

var STRING_FIELDS = [
	"flexDirection",
	"justifyContent",
	"alignItems", "alignSelf",
	"flexWrap",
	"position"
];

var IGNORE_IF_PRESENT = {
	"marginLeft": "margin",
	"marginRight": "margin",
	"marginTop": "margin",
	"marginBottom": "margin",
	"paddingLeft": "padding",
	"paddingRight": "padding",
	"paddingTop": "padding",
	"paddingBottom": "padding",
	"borderLeftWidth": "borderWidth",
	"borderRightWidth": "borderWidth",
	"borderTopWidth": "borderWidth",
	"borderBottomWidth": "borderWidth",
};

module.exports = getStyle;

function getStyle(element) {
	return getRules(element).map(findFields).reduce(assign, {});
}

function assign(a, b) {
	return xtend(a, b);
}

// Taken from http://stackoverflow.com/a/22638396
function getRules(element) {
	var sheets = document.styleSheets;
	var result = [];
	for (var sheetIndex in sheets) {
		var rules = sheets[sheetIndex].rules || sheets[sheetIndex].cssRules;
		for (var ruleIndex in rules) {
			var rule = rules[ruleIndex];
			if (matches(element, rule.selectorText) && rule.style)
				result.push(rule.style);
		}
	}
	return result;
}

function findFields(rule) {
	var result = {};
	NUMBERS_FIELDS.forEach(function(field) {
		var canIgnore = IGNORE_IF_PRESENT[field];
		var shouldIgnore = canIgnore && rule.getPropertyValue(canIgnore);
		if (shouldIgnore) return;
		var fieldSnaked = camelToSnake(field, "-");
		var value = rule.getPropertyValue(fieldSnaked);
		if (!value) return;
		var first = value.split(" ")[0];
		result[field] = parseDimension(first).value;
	});
	STRING_FIELDS.forEach(function(field) {
		var fieldSnaked = camelToSnake(field, "-");
		var value = rule.getPropertyValue(fieldSnaked);
		if (!value) return;
		result[field] = value;
	});
	return result;
}
