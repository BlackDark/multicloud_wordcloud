
import UIHelper from "./UIHelper";

// Shapes
import RectConstructor from "../../../visualization/shape/ShapeRectangular";
import CircleConstructor from "../../../visualization/shape/ShapeCircle";
import EllipseConstructor from "../../../visualization/shape/ShapeEllipse";

import ShapeParameter from "../../../visualization/shape/ShapeParameters";
import UIFont from "../general/UIFontManipulation";

const GRAPH_SELECTOR = "#graph";

export default class UIShapeParameter {
	constructor(containerQuerySelector, graphObject) {
		this._topContainer = containerQuerySelector;
		this._topContainerD3Selector = d3.select(this._topContainer[0]);
		this._container = this._topContainerD3Selector.append("div").attr("class", "ui segment container");
		this._graphObject = graphObject;

		this.addToLayout();
	}

	addToLayout() {
		this._addShapeForm();
		this._addFillingConfiguration();
		this._addButtons();
	}

	get parameterObject() {
		let parameter = new ShapeParameter();
		parameter.shapeConstructor = this._getSelectedShape();

		this._setConfigParameters(parameter);

		return parameter;
	}

	get defaultParameterObject() {
		return new ShapeParameter();
	}

	_getSelectedShape() {
		var shape;

		this.radioShapes.forEach(element => {
			if (d3.select(element.domObject).select("input").node().checked) {
				shape = element.shapeConstructor;
			}
		});

		return shape;
	}

	_addShapeForm() {
		this.shapeDiv = this._container.append("div").attr("class", "ui container");

		this.shapeDiv.append("h3")
			.attr("class", "ui medium header")
			.text("Form");

		this.formDiv = this.shapeDiv.append("div")
			.attr("class", "ui form");
		this.groupDiv = this.formDiv.append("div")
			.attr("class", "grouped fields");
		this.radioShapes = [];

		let rect = UIHelper.getRadioButton("shapeForm", true, "Rectangular");
		this.radioShapes.push({
			"domObject": rect,
			"shapeConstructor": RectConstructor
		});
		this.groupDiv.node().appendChild(rect);

		let circle = UIHelper.getRadioButton("shapeForm", false, "Circlular");
		this.radioShapes.push({
			"domObject": circle,
			"shapeConstructor": CircleConstructor
		});
		this.groupDiv.node().appendChild(circle);

		let ellipse = UIHelper.getRadioButton("shapeForm", false, "Elliptical");
		this.radioShapes.push({
			"domObject": ellipse,
			"shapeConstructor": EllipseConstructor
		});
		this.groupDiv.node().appendChild(ellipse);
	}

	_addFillingConfiguration() {
		this.fillingConfigDiv = this._container.append("div").attr("class", "ui padded container");

		this.fillingConfigDiv.append("h2")
			.attr("class", "ui medium header")
			.text("Parameters");

		let checkBoxArea = this.fillingConfigDiv.append("div").attr("class", "grouped fields");

		this.configParameters = [];

		var checkFillSpace = UIHelper.getCheckbox("Fill space", ShapeParameter.fillSpacePath);
		this.configParameters.push({
			"domInput": d3.select(checkFillSpace).select("input").node()
		});
		checkBoxArea.node().appendChild(checkFillSpace);

		var checkFillWords = UIHelper.getCheckbox("Fill words", ShapeParameter.placeAllWordsPath);
		this.configParameters.push({
			"domInput": d3.select(checkFillWords).select("input").node()
		});
		checkBoxArea.node().appendChild(checkFillWords);

		var centrateWords = UIHelper.getCheckbox("Centrate", ShapeParameter.centrateWordsPath);
		this.configParameters.push({
			"domInput": d3.select(centrateWords).select("input").node()
		});
		checkBoxArea.node().appendChild(centrateWords);
	}

	_setConfigParameters(parameter) {
		this.configParameters.forEach(element => {
			parameter[element.domInput.name] = element.domInput.checked;
		})
	}

	_addButtons() {
		let buttonContainer = this._container.append("div").attr("class", "ui container");
		let button = UIHelper.getButton("Apply layout", this._buttonApplyLayout, this);

		buttonContainer.node().appendChild(button);
	}

	_buttonApplyLayout() {
		var queryDimElement = $(GRAPH_SELECTOR).find('#graphLoading');
		UIHelper.setLoading(queryDimElement[0], true);
		setTimeout(function() {
			this._graphObject.currentGraph._applyLayout.call(this._graphObject.currentGraph, this, this._callbackAfterLayout());
		}.bind(this), 50);
	}

	_callbackAfterLayout() {
		return function() {
			UIFont.refreshFontValues();
			UIHelper.setLoading($(GRAPH_SELECTOR).find('#graphLoading')[0], false);
		}
	}
}
