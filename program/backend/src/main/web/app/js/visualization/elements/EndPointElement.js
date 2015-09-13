import BaseElement from "js/visualization/elements/BaseElement";

const color = d3.scale.category10();

export default class EndPointElement extends BaseElement {
	constructor(id) {
		super(id);
	}

	draw(container) {
		super.draw(container);

		container.append("circle")
			.classed("endpoint", true)
			.style("fill", color(this.id))
			.attr("r", 10);
	}
}
