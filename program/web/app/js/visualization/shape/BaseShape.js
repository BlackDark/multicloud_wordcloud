

export default class BaseShape {
	constructor() {

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
