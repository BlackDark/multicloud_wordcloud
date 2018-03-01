
export default class RequestParameters {
	constructor() {
		this._numberOfWords = 200;
	}

	get numberOfWords() {
		return this._numberOfWords;
	}

	set numberOfWords(numberOfWords) {
		this._numberOfWords = numberOfWords;
	}

	static get numberOfWordsPath() {
		return "numberOfWords";
	}
}
