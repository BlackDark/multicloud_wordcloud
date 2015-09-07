

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
		.text(text);

		if(clickFunction !== undefined && caller !== undefined) {
			selectedButton.on("click", clickFunction.bind(caller));
		}

		return buttonElement;
	}

	static getButtonTest(text, objectToCallFrom, pathArray, argArray) {
		let buttonElement = document.createElement("button");
		let selectedButton = d3.select(buttonElement);
		let object = objectToCallFrom;

		selectedButton.attr("class", "ui button")
			.text(text)
			.on("click", function() {
				let currentObject = object;
				for(let i = 0; i < pathArray.length; i++) {
					console.log("Path: " + pathArray[i], " Args: " + argArray[i]);

					if(argArray[i] !== undefined) {
						currentObject = currentObject[pathArray[i]].call(currentObject, argArray[i]);
					} else {
						currentObject = currentObject[pathArray[i]];
					}

					if(currentObject === undefined) {
						console.warn("Path for button is undefined.")
						return;
					}
				}
			});

		return buttonElement;
	}

	static getButtonGroup(buttonArrayDOM, activeIndex) {
		let buttonGroupDiv = document.createElement("div");
		let selectedDiv = d3.select(buttonGroupDiv).attr("class", "ui fluid buttons");
		buttonArrayDOM.forEach(element => selectedDiv.node().appendChild(element));

		if(activeIndex !== undefined) {
			let activeButtonDOM = selectedDiv.selectAll("button")[0][activeIndex];
			d3.select(activeButtonDOM).classed("active", true);
		}

		return buttonGroupDiv;
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

		let input = inputElement.append("input")
			.classed("multiCloud-inputNumber", true)
			.attr("type", inputType)
			.attr("name", name)
			.attr("placeholder", placeHolder);

		if (defaultValue) {
			input.property('value', defaultValue);
		}

		if (disabled) {
			input.property("disabled", true);
		}

		labelElement
			.text(text);

		return createdElement;
	}

	static getInputNumber(text, name, disabled, defaultValue, placeHolder) {
		return UIHelper.getInput(...arguments, "number");
	}

	static getInputText(text, name, disabled, defaultValue, placeHolder) {
		return UIHelper.getInput(...arguments, "text");
	}

	static setLoading(domElement, booleanLoaded) {
		d3.select(domElement).classed("active", booleanLoaded);
	}
}
