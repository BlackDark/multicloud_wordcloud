import BaseShape from "js/visualization/shape/BaseShape";

export default class ShapeRectangular extends BaseShape {
	constructor() {
		super(...arguments);

		this._field = this._createField();
		this._initializeFieldValues();
	}


	get freeInitialSpace() {
		return this._width * this._height;
	}

	_createField() {
		let field = new Array(this._width);
		for (let i = 0; i < this._width; i++) {
			field[i] = new Array(this._height);
		}

		return field;
	}

	_initializeFieldValues() {
		for (let i = 0; i < this._field.length; i++) {
			for (let j = 0; j < this._field[i].length; j++) {
				this._field[i][j] = false;
			}
		}
	}
}
