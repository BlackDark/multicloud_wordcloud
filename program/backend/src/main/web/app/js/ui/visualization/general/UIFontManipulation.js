import UIHelper from "../shape/UIHelper";

export default class UIFontManipulation {
	constructor(containerQuerySelector) {
		this._topContainer = containerQuerySelector;
		this._topContainerD3Selector = d3.select(this._topContainer[0]);
		this._container = this._topContainerD3Selector.append("div").attr("class", "ui segment");

		this._addToLayout();
	}

	_addToLayout() {
		this._container.append("h2")
			.attr("class", "ui header")
			.text("General");

		this._itemContainer = this._container.append("div").attr("class", "ui items");

		let inputMin = UIHelper.getInputNumber("Min font-size", "minimiumsize", false, 8, undefined);
		this._itemContainer.append("div").attr("class", "item").node().appendChild(inputMin);

		let inputMax = UIHelper.getInputNumber("Max font-size", "maximumsize", false, 40, undefined);
		this._itemContainer.append("div").attr("class", "item").node().appendChild(inputMax);

		let inputUse = UIHelper.getCheckbox("Use font-sizes", "fixedsize", undefined, false);
		this._itemContainer.append("div").attr("class", "item").node().appendChild(inputUse);
	}
}
