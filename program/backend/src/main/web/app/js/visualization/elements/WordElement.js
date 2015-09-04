import BaseElement from "js/visualization/elements/BaseElement";
import StringExt from "js/visualization/util/StringExt";

const color = d3.scale.category10();
const emDivisor = 11;

export default class WordElement extends BaseElement{
	constructor(id) {
		super(id);
	}

	changeSize(newSize) {
		this.size = newSize;
		this._container.select("text")
			.style("font-size", function(d) {
				return d.size / emDivisor + "em"; });
		setDimensions(this);
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

		this._textSelectedDom = container.append("text")
			.classed("word-text", true)
			.style("fill", function(d, i) {
				index = d.endPointConnections.indexOf(Math.max.apply(Math, d.endPointConnections));
				return color(index);
			})
			.style("opacity", d => d.endPointConnections[index])
			.style("font-size", function(d) {
				return d.size / emDivisor + "em"; })
			.text(function(d) {
				return d.text;
			});

		setDimensions(this);

		$(container.node()).find("text").tooltipsy({
			alignTo: 'cursor',
			offset: [10, 10],
			content: this.text + "<br>" + "Width: " + Math.round(this.width) + "<br>" + "Height: " + Math.round(this.height)
		});
	}

	hover(hovered) {
		this._container.classed("hovered", hovered);
		this._textSelectedDom.classed("hovered", hovered);
	}
}

function setDimensions(object) {
	let rect = object._container.select("text").node().getBoundingClientRect();
	object.height = rect.height;
	object.width = rect.width;
}
