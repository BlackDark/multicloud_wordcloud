import TimingHelper from "js/visualization/util/TimingHelper";
import GeneratorUtil from "js/visualization/util/GeneratorUtil";

const methodNotImplemented = "METHOD IS NOT IMPLEMENTED!";
export default class BaseShape {
	constructor(height, width, endpoints) {
		this._height = height;
		this._width = width;
		this._endpoints = endpoints;
		this._wordStorage = [];
		this._center = {
			"x": this._width / 2,
			"y": this._height / 2
		};
	}

	get freeInitialSpace() {
		// TODO
		throw methodNotImplemented;
	}

	_initializeFieldValues() {
		throw methodNotImplemented;
	}

	get storedWords() {
		return this._wordStorage;
	}

	get possiblePixelsArray() {
		return this._possiblePixels;
	}

	initialize() {
		this._field = GeneratorUtil._createArray(this._width, this._height);
		this._possiblePixels = [];
		this._initializeFieldValues();
		this._originalField = this.copyField(this._field, GeneratorUtil._createArray(this._width, this._height));

		this._endpointToPixelDistances = new Map();

		let timing = new TimingHelper("Calculating distances: ");
		timing.startRecording();
		this._calculatePixelDistances();
		timing.endRecording();
		this._originalDistanceMap = this.copyMap(this._endpointToPixelDistances);
	}

	placeNearEndPoints(endpoint, element) {
		let distanceArray = this._endpointToPixelDistances.get(endpoint);

		if (distanceArray === undefined) {
			throw "Distance array should exists for endpoint: " + endpoint;
		}

		for (let pixelPoint of distanceArray) {
			if (this._place(pixelPoint, element)) {
				return true;
			}
		}

		return false;
	}

	_calculatePixelDistances() {
		for (let current of this._endpoints) {
			this._endpointToPixelDistances.set(current, this._calculatePixelDistanceOrder.call(this, current));
		}
	}

	// Returns an array sorted in distance of the elements to the endpoint.
	_calculatePixelDistanceOrder(endPoint) {
		let distanceAndElement = [];

		this._possiblePixels.forEach(currentCoord => {
			let dx = endPoint.x - currentCoord.x;
			let dy = endPoint.y - currentCoord.y;

			distanceAndElement.push({
				"distance": Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
				"x": currentCoord.x,
				"y": currentCoord.y
			});
		});

		distanceAndElement.sort(function (a, b) {
			return a.distance - b.distance;
		});

		return distanceAndElement;
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
				this._removeUsedPixel(xIndex, yIndex);
			}
		}

		this._wordStorage.push({
			"x": coord.x,
			"y": coord.y,
			"element": element
		});
		return true;
	}

	_removeUsedPixel(x, y) {
		for (let currentArray of this._endpointToPixelDistances.entries()) {
			for (let i = 0; i < currentArray.length; i++) {
				if (currentArray[i].x === x && currentArray[i].y === y) {
					currentArray.splice(i, 1);
					break;
				}
			}
		}
	}

	resetPlacing() {
		this._wordStorage.length = 0;
		this._endpointToPixelDistances = this.copyMap(this._originalDistanceMap);
		this._field = this.copyField(this._originalField, GeneratorUtil._createArray(this._width, this._height));
	}

	copyMap(oldMap) {
		let newMap = new Map();

		for (let [key, value] of oldMap) {
			let copyArray = [].concat(value);
			newMap.set(key, copyArray);
		}

		return newMap;
	}

	copyField(field, newField) {
		for(let i = 0; i < field.length; i++) {
			for(let j = 0; j < field[0].length; j++) {
				newField[i][j] = field[i][j];
			}
		}

		return newField;
	}
}
