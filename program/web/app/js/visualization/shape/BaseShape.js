

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

		this._endpointToPixelDistances = new Map();
		let starttime=(new Date()).getTime();
		this._calculatePixelDistances();
		let endtime=(new Date()).getTime();
		let dif = endtime - starttime;
		console.log("Distance calculation took: " + dif + " ms.");
	}

	get storedWords() {
		return this._wordStorage;
	}

	get freeInitialSpace() {
		throw methodNotImplemented;
	}

	placeNearEndPoints(endpoint, element) {
		throw methodNotImplemented;
	}

	_calculatePixelDistances() {
		for(let current of this._endpoints) {
			this._endpointToPixelDistances.set(current, this._calculatePixelDistanceOrder.call(this, current));
		}
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
}
