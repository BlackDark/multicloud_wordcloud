

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
}
