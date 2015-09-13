import TimingHelper from "js/visualization/util/TimingHelper";
import GeneratorUtil from "js/visualization/util/GeneratorUtil";
import MathUtil from "../util/MathUtil";

const methodNotImplemented = "METHOD IS NOT IMPLEMENTED!";
const MAX_PLACE_RADIUS = 100;

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

		this._initialEndPointPositions();
	}

	get freeInitialSpace() {
		// TODO
		throw methodNotImplemented;
	}

	_initializeFieldValues() {
		throw methodNotImplemented;
	}

	_calculateEndPointPositions() {
		throw methodNotImplemented;
	}

	_initialEndPointPositions() {
		let width = this._width;
		let height = this._height;

		this._endpoints.forEach(function(endPoint, index){
			let angleStep = 360 / this._endpoints.length;
			let startAngle = 45;
			let center = {
				"x": width / 2,
				"y": height / 2
			};
			let radius = width > height ? width : height;
			let point = MathUtil.getPointOnCircle(radius, startAngle + angleStep * index);

			endPoint.px = point.x + center.x;
			endPoint.py = point.y + center.y;
			endPoint.x = endPoint.px;
			endPoint.y = endPoint.py;
		}.bind(this));
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
		this._originalField = GeneratorUtil.copyField(this._field);

		this._endpointToPixelDistances = new Map();
		let timing = new TimingHelper("Calculating distances: ");
		timing.startRecording();
		this._calculatePixelDistances();
		timing.endRecording();
		this._originalDistanceMap = GeneratorUtil.copyMapObjectToArray(this._endpointToPixelDistances);

		this._calculateEndPointPositions();
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

	_checkPlacing(topLeftPoint, element) {
		// Look if enough free space
		for (let yIndex = topLeftPoint.y; yIndex < topLeftPoint.y + element.height; yIndex++) {
			for (let xIndex = topLeftPoint.x; xIndex < topLeftPoint.x + element.width; xIndex++) {
				if (this._width <= topLeftPoint.x + element.width || this._height <= topLeftPoint.y + element.height || this._field[xIndex][yIndex]) {
					return false;
				}
			}
		}

		return true;
	}

	removePixelsFor(element) {
		this._wordStorage.forEach(storeObject => {
			if(storeObject.element === element) {
				this._setFieldValueFor(storeObject, false);
			}
		})
	}

	setPixelsFor(element) {
		this._wordStorage.forEach(storeObject => {
			if(storeObject.element === element) {
				storeObject.x = element.x;
				storeObject.y = element.y;
				this._setFieldValueFor(storeObject, true);
			}
		})
	}

	_setFieldValueFor(storeObject, booleanValue) {
		let element = storeObject.element;
		for (let yIndex = storeObject.y; yIndex < storeObject.y + element.height; yIndex++) {
			for (let xIndex = storeObject.x; xIndex < storeObject.x + element.width; xIndex++) {
				this._field[xIndex][yIndex] = booleanValue;
			}
		}
	}

	_inRadius(coord, element) {
		return MAX_PLACE_RADIUS > MathUtil.getDistance(coord, element);
	}

	_place(coord, element) {
		if (!this._inRadius(coord, element)) {
			return false;
		}

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
		this._endpointToPixelDistances = GeneratorUtil.copyMapObjectToArray(this._originalDistanceMap);
		this._field = GeneratorUtil.copyField(this._originalField);
	}
}
