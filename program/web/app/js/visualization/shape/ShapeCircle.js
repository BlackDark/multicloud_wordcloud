import BaseShape from "js/visualization/shape/BaseShape";
import GeneratorUtil from "js/visualization/util/GeneratorUtil";

export default class ShapeCircle extends BaseShape {
	constructor(height, width, endpoints) {
		super(...arguments);

		this._field = GeneratorUtil._createArray(this._width, this._height);
		this._radius = this._width < this._height ? this._width / 2 : this._height / 2;

		this._initializeField();
	}

	get fieldFilling() {
		return this._field;
	}

	printShape() {
		for (let i = 0; i < this._field[0].length; i++) {
			let line = "";
			for (let j = 0; j < this._field.length; j++) {
				if(this._field[j][i]) {
					line = line.concat(1);
				} else {
					line = line.concat(0);
				}
			}
			console.log(line);
		}
	}

	_initializeField() {
		for (let i = 0; i < this._field.length; i++) {
			for (let j = 0; j < this._field[i].length; j++) {
				this._field[i][j] = !inCircle.call(this, i, j);
			}
		}

		function inCircle(x, y) {
			return Math.pow((x - this._center.x), 2) + Math.pow((y - this._center.y), 2) <= Math.pow(this._radius, 2);
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
