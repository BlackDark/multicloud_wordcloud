import BaseElement from "js/visualization/elements/BaseElement";

export default class EndPointElement extends BaseElement {
	constructor(id) {
		super(id);
	}

	draw(container) {
		super.draw(container);

		container.append("circle")
			.classed("endpoint", true)
			.attr("r", 10);
	}
}
