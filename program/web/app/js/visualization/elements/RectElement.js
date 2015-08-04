import BaseElement from "js/visualization/elements/BaseElement";

export default class RectElement extends BaseElement {
	constructor(id) {
		super(id);
	}

	draw(container) {
		super.draw(container);

		container.append("rect")
			.classed("node", true)
			.classed("rectTest", true)
			.attr("width", function (d) {
				return d.width
			})
			.attr("height", function (d) {
				return d.size
			});
	}
}
