import BaseElement from "js/visualization/elements/BaseElement";
import GeneratorUtil from "../util/GeneratorUtil";

export default class EndPointElement extends BaseElement {
	constructor(id) {
		super(id);
	}

	draw(container) {
		super.draw(container);

		container.append("circle")
			.classed("endpoint", true)
			.style("fill", GeneratorUtil.getColorForId(this.id))
			.attr("r", 10);

		container.append("text").text(this.id);
	}
}
