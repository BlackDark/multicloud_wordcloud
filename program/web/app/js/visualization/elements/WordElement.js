import BaseElement from "js/visualization/elements/BaseElement";

export default class WordElement extends BaseElement{
	constructor(id) {
		super(id);
	}

	draw(container) {
		super.draw(container);

		let color = d3.scale.category10();

		container.append("text")
			.classed("word-text", true)
			.style("fill", function(d, i) { return color(i); })
			//.attr("text-anchor", "middle")
			.style("font-size", function(d) {
				return d.size + "px"; })
			.text(function(d) {
				return d.text;
			});
	}
}
