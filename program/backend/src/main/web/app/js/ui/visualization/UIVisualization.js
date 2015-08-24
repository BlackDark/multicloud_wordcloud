import UIFontManipulation from "./general/UIFontManipulation";

export default class UIVisualization {
	constructor(container) {
		this._topContainer = container;

		console.log("UI VISUALIZATION");
		this._generateSelectors();
		this._drawLayout();
	}

	_drawLayout() {
		let font = new UIFontManipulation(this._controlSelector)
	}

	_generateSelectors() {
		this._controlSelector = $('#forbutton');
	}
}
