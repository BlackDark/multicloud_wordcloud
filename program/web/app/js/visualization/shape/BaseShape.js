

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

	get storedWords() {
		return this._wordStorage;
	}

	inBounds(element) {

		return false;
	}

	placeNearEndPoints(endpoint, element) {

		return false;
	}
}
