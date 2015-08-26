
import * as FontScaleEnum from "./FontScaleEnum";

export default class GeneralParameters {
	constructor() {
		this._maximalFontSize = 32;
		this._minimalFontSize = 8;
		this._scaleFormat = FontScaleEnum.DEFAULT;
	}

	get scaleFormat() {
		return this._scaleFormat;
	}

	set scaleFormat(scaleFormat) {
		this._scaleFormat = scaleFormat;
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

	static get scaleFormatPath() {
		return "scaleFormat";
	}
}
