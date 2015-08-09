

export default class BaseShape {
	constructor(height, width, endpoints) {
		this._height = height;
		this._width = width;
		this._endpoints = endpoints;
	}

	inBounds(element) {

		return false;
	}

	placeNearEndPoints(endpoint, element) {

		return false;
	}

	getEndPoints() {

		return null;
	}
}
