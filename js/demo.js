try {
	let d3 = require("d3");
} catch (error) {
}

let w = 512;
let h = 300;

let svg = d3.select("#demo")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

let markerdef = document.createElement("defs")
markerdef.innerHTML = '<marker id="triangle" markerunits="strokeWidth" markerwidth="5" markerheight="4" refx="0" refy="2" orient="auto"><path d="M 0 0 L 5 2 L 0 4 z"></path></marker>'

svg.append(() => markerdef)

let W = [2, 1, 3, 2];
let V = [3, 2, 4, 2];

let range = d3.range(W.length);
let pos = range.flatMap(i => range.map(j => [i, j]))
let size = 40

let g = svg.selectAll("g")
	.data(pos)
	.enter()
	.append("g");

let rect = g.append("rect")

rect.data(pos).enter()
	.attr("x", d => (1 + d[0]) * size * 1.5)
	.attr("y", d => (1 + d[1]) * size * 1.5)
	.attr("width", size)
	.attr("height", size)
	.attr("style", "fill: none; stroke: black; stroke-width: 1")
