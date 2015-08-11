
export default class LayoutParameters {
	constructor() {
		this._fillSpace = false;
		this._placeAllWords = false;
	}

	get fillSpace() {
		return this._fillSpace;
	}

	set fillSpace(booleanValue) {
		this._fillSpace = booleanValue;
	}

	get placeAllWords() {
		return this._placeAllWords;
	}

	set placeAllWords(booleanValue) {
		this._placeAllWords = booleanValue;
	}

}
