
import UIHelper from "../shape/UIHelper";

export default class UIUploadParameters {
	constructor(containerQuerySelector, graphObject) {
		this._topContainer = containerQuerySelector;
		this._topContainerD3Selector = d3.select(this._topContainer[0]);
		this._container = this._topContainerD3Selector.append("div").attr("class", "ui segment container");
		this._graphObject = graphObject;

		this._addToLayout();
	}

	_addToLayout() {
		this._container.append("h2")
			.attr("class", "ui header")
			.text("Document information");

		this._itemContainer = this._container.append("div").attr("class", "ui items");

		this._inputNumWords = UIHelper.getInputNumber("Number of words", "numWords", false, undefined, "Number of words...");
		this._itemContainer.append("div").attr("class", "item").node().appendChild(this._inputNumWords);
	}

	updateNumWords(numWords) {
		$('input[name="numWords"]').val(+numWords);
	}
}
