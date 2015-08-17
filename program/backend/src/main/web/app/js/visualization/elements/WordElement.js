import BaseElement from "js/visualization/elements/BaseElement";
import StringExt from "js/visualization/util/StringExt";

const color = d3.scale.category10();

export default class WordElement extends BaseElement{
	constructor(id) {
		super(id);
	}

	changeSize(newSize) {
		this.size = newSize;
		this.height = newSize;
		this.width = StringExt.widthText(this.text, null, this.size);

		this._container.select("text")
			.style("font-size", function(d) {
				return d.size + "px"; });
	}

	incrementSize() {
		this.changeSize(this.size + 1);
	}

	decrementSize() {
		this.changeSize(this.size - 1);
	}

	draw(container) {
		super.draw(container);

		let index;

		container.append("text")
			.classed("word-text", true)
			.style("fill", function(d, i) {
				index = d.endPointConnections.indexOf(Math.max.apply(Math, d.endPointConnections));
				return color(index);
			})
			.style("opacity", d => d.endPointConnections[index])
			//.attr("text-anchor", "middle")
			.style("font-size", function(d) {
				return d.size + "px"; })
			.text(function(d) {
				return d.text;
			});
	}
}