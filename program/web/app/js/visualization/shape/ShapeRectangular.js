import BaseShape from "js/visualization/shape/BaseShape";

export default class ShapeRectangular extends BaseShape {
	constructor() {
		super(...arguments);

	}

	get freeInitialSpace() {
		return this._width * this._height;
	}

	_initializeFieldValues() {
		for (let i = 0; i < this._field.length; i++) {
			for (let j = 0; j < this._field[i].length; j++) {
				this._field[i][j] = false;
				this._possiblePixels.push({
					"x": i,
					"y": j
				});
			}
		}
	}
}
