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
		let font = new UIFontManipulation(this._controlSelector, this._graphObject);
		let shape = new UIShape(this._controlSelector, this._graphObject);
	}

	_generateSelectors() {
		this._controlSelector = this._topContainer.find('#forbutton');
	}

	resize() {
		let width = this._topContainer.find('#graph').width();
		let height = this._topContainer.find('#graph').height();

		this._graphObject.resize(width, height);
	}
}
