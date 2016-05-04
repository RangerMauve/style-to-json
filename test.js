"use strict";
var tape = require("tape");
var insertCSS = require("insert-css");
var styleToJSON = require("./");


var styleString = "div {flex: 1; width: 10em; height: 100%; padding: 20px;}" +
	" * { margin-top: 4px; flex-direction: row; justify-content: flex-end; }" +
	" .nomatching {flex-wrap: nowrap}";
insertCSS(styleString);

tape(function(t) {
	t.plan(1);

	var element = document.createElement("div");

	element.setAttribute("class", "foobar");

	document.body.appendChild(element);

	var resultStyle = styleToJSON(element);

	var expectedStyle = {
		flex: 1,
		width: 10,
		height: 100,
		marginTop: 4,
		flexDirection: "row",
		justifyContent: "flex-end",
		padding: 20
	};

	t.deepEqual(resultStyle, expectedStyle, "style object gets parsed properly");
});
