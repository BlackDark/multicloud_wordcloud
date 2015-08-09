import BaseShape from "js/visualization/shape/BaseShape";

export default class ShapeRectangular extends BaseShape {
	constructor() {
		super(...arguments);

		this._field = this._createField();
		this._initializeFieldValues();
		this._center = {
			"x": this._width / 2,
			"y": this._height / 2
		};

		this._wordStorage = [];
	}

	get storedWords() {
		return this._wordStorage;
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
		let distanceObjectsArray = this._calculatePixelDistanceOrder(endpoint);

		for(let pixelPoint of distanceObjectsArray) {
			if (this._place(pixelPoint, element)) {
				return true;
			}
		}

		return false;
	}

	// Returns an array sorted in distance of the elements to the endpoint.
	_calculatePixelDistanceOrder(endPoint) {
		let distanceAndElement = [];

		for (let yIndex = 0; yIndex< this._height; yIndex++) {
			for (let xIndex = 0; xIndex < this._width; xIndex++) {
				let dx = endPoint.x - xIndex;
				let dy = endPoint.y - yIndex;

				distanceAndElement.push({
					"distance": Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
					"x": xIndex,
					"y": yIndex
				});
			}
		}

		distanceAndElement.sort(function(a,b) {
			return a.distance - b.distance;
		});

		return distanceAndElement;
	}

	// Depending on parameters multi-dimensional arrays are created.
	// Eq. (3) creates [0,0,0] and (3,2) creates [ [0,0], [0,0], [0,0]] etc.
	_createArray(length) {
		let arr = new Array(length || 0),
			i = length;

		if (arguments.length > 1) {
			let args = Array.prototype.slice.call(arguments, 1);
			while (i--) arr[length - 1 - i] = this._createArray.apply(this, args);
		}

		return arr;
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
