
export default class GeneralParameters {
	constructor() {
		this._maximalFontSize = 32;
		this._minimalFontSize = 8;
	}

	get maximalFontSize() {
		return this._maximalFontSize;
	}

	set maximalFontSize(maximalFontSize) {
		this._maximalFontSize = maximalFontSize;
	}

	get minimalFontSize() {
		return this._minimalFontSize;
	}

	set minimalFontSize(minimalFontSize) {
		this._minimalFontSize = minimalFontSize;
	}

	static get maximalFontSizePath() {
		return "maximalFontSize";
	}

	static get minimalFontSizePath() {
		return "minimalFontSize";
	}
}
