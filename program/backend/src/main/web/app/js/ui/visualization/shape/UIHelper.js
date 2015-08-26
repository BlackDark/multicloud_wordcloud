

export default class UIHelper {

	static getRadioButton(name, checked, label, disabled) {
		let divObject =  document.createElement("div");
		let formObject = d3.select(divObject);
		formObject.classed("field", true);

		let selectedObject = formObject.append("div");

		if(disabled) {
			selectedObject.attr("class", "ui disabled radio checkbox");
		} else {
			selectedObject.attr("class", "ui radio checkbox");
		}

		let input = selectedObject.append("input")
		.attr("type", "radio")
		.attr("name", name)
			.attr("disabled", disabled);

		if(checked) {
			input.attr("checked", "checked");
		}

		selectedObject.append("label")
		.text(label);


		return divObject;
	}

	static getButton(text, clickFunction, caller) {
		let buttonElement = document.createElement("button");
		let selectedButton = d3.select(buttonElement);

		selectedButton.attr("class", "ui button")
		.text(text)
		.on("click", clickFunction.bind(caller));

		return buttonElement;
	}

	static getCheckbox(text, name, disabled, checked) {
		let element = document.createElement("div");
		let fieldElement = d3.select(element).attr("class", "field");
		let selectedElement = fieldElement.append("div");

		if(disabled) {
			selectedElement.attr("class", "ui disabled checkbox");
		} else {
			selectedElement.attr("class", "ui checkbox");
		}

		let input = selectedElement.append("input")
			.attr("type", "checkbox")
			.attr("name", name)
			.attr("disabled", disabled);

		if(checked) {
			input.attr("checked", "checked");
		}

		selectedElement.append("label")
			.text(text);

		return element;
	}

	static getInput(text, name, disabled, defaultValue, placeHolder, inputType) {
		let createdElement = document.createElement("div");
		let gridElement = d3.select(createdElement).attr("class", "ui padded grid container multicloud-input-parameter");

		let inputElement = gridElement.append("div").attr("class", "ui input fitted five wide column test");
		let labelElement = gridElement.append("div").attr("class", "ui label ten wide column multiCloud-inputNumberLabel");

		if (disabled) {
			inputElement.classed("disabled", true);
		}

		let input = inputElement.append("input")
			.classed("multiCloud-inputNumber", true)
			.attr("type", inputType)
			.attr("name", name)
			.attr("placeholder", placeHolder);

		if (defaultValue) {
			input.property('value', defaultValue);
		}

		labelElement
			.text(text);

		return createdElement;
	}

	static getInputNumber(text, name, disabled, defaultValue, placeHolder) {
		return UIHelper.getInput(...arguments, "number");
	}
}
