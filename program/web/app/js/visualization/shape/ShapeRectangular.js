import BaseShape from "js/visualization/shape/BaseShape";

export default class ShapeRectangular extends BaseShape {
	constructor() {
		super(...arguments);

		this._field = this._createField();
		this._initializeFieldValues();
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

	placeNearEndPoints(endpoint, element) {
		let distanceArray = this._endpointToPixelDistances.get(endpoint);

		if(distanceArray === undefined) {
			throw "Distance array should exists for endpoint: " + endpoint;
		}

		for(let pixelPoint of distanceArray) {
			if (this._place(pixelPoint, element)) {
				return true;
			}
		}

		return false;
	}

	_place(coord, element) {
		// Look if enough free space
		for (let yIndex = coord.y; yIndex < coord.y + element.height; yIndex++) {
			for (let xIndex = coord.x; xIndex < coord.x + element.width; xIndex++) {
				if (this._width <= coord.x + element.width || this._height <= coord.y + element.height || this._field[xIndex][yIndex]) {
					return false;
				}
			}
		}

		// Store word
		for (let yIndex = coord.y; yIndex < coord.y + element.height; yIndex++) {
			for (let xIndex = coord.x; xIndex < coord.x + element.width; xIndex++) {
				this._field[xIndex][yIndex] = true;
			}
		}

		this._wordStorage.push({
			"x": coord.x,
			"y": coord.y,
			"element": element
		});
		return true;
	}
}
