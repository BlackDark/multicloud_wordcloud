import UIFontManipulation from "./general/UIFontManipulation";
import UIShape from "./shape/UIShapeParameter";

export default class UIVisualization {
	constructor(container, graphObject) {
		this._topContainer = container;
		this._graphObject = graphObject;

		console.log("UI VISUALIZATION");
		this._generateSelectors();
		this._drawLayout();
	}

	_drawLayout() {
		let font = new UIFontManipulation(this._controlSelector);
		let shape = new UIShape(this._controlSelector);
	}

	_generateSelectors() {
		this._controlSelector = this._topContainer.find('#forbutton');
	}
}
