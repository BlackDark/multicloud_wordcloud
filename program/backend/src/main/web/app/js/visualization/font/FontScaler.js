
import GeneralParameters from "../configuration/GeneralParameters";
import * as FontScaleEnum from "../configuration/FontScaleEnum";

/**
 * In default mode no min/max font sizes are applied.
 */
export default class FontScaler {
	constructor(textNodes, minFreq, maxFreq) {
		this.textNodes = textNodes;
		this._currentFormat = FontScaleEnum.SQRT;
		this._currentMinFont = undefined;
		this._currentMaxFont = undefined;
		this.minFreq = minFreq;
		this.maxFreq = maxFreq;
	}
	
	changeScaling(generalParameter) {
		this._currentMinFont = generalParameter[GeneralParameters.minimalFontSizePath];
		this._currentMaxFont = generalParameter[GeneralParameters.maximalFontSizePath];
		this._currentFormat = generalParameter[GeneralParameters.scaleFormatPath];

		this.recalculatedScalingFunctions();
		let scaleForFreq = this._getScaleFunction();

		if(scaleForFreq === undefined) {
			this.restoreDefault();
			return;
		}

		this.textNodes.forEach(node => node.changeSize(scaleForFreq(node.frequency)));
	}

	recalculatedScalingFunctions() {
		this._linearScaleFunction = linearScaleFunction(this.minFreq, this.maxFreq, this._currentMinFont, this._currentMaxFont);
		this._quadraticScaleFunction = quadraticScaleFunction(this.minFreq, this.maxFreq, this._currentMinFont, this._currentMaxFont);
		this._sqrtScaleFunction = sqrtScaleFunction(this.minFreq, this.maxFreq, this._currentMinFont, this._currentMaxFont);
		this._logScaleFunction = logScaleFunction(this.minFreq, this.maxFreq, this._currentMinFont, this._currentMaxFont);
	}

	getFontSizeForFreq(freq) {
		if (freq === undefined || freq === 0) {
			throw "Not valid frequency!";
		}

		return this._getScaleFunction()(freq);
	}

	_getScaleFunction() {
		switch (this._currentFormat) {
			case FontScaleEnum.DEFAULT:
				return undefined;
				break;
			case FontScaleEnum.LINEAR:
				return this._linearScaleFunction;
				break;
			case FontScaleEnum.QUADRATIC:
				return this._quadraticScaleFunction;
				break;
			case FontScaleEnum.SQRT:
				return this._sqrtScaleFunction;
				break;
			case FontScaleEnum.LOG:
				return this._logScaleFunction;
				break;
		}
	}
	
	restoreDefault() {
		this.textNodes.forEach(node => {
			node.changeSize(node.originalSize);
		});
	}
}

function linearScaleFunction(minFreq, maxFreq, minFont, maxFont) {
	return function(frequency) {
		return ((maxFont - minFont) / (maxFreq - minFreq)) * (frequency - minFreq) + minFont;
	}
}

function quadraticScaleFunction(minFreq, maxFreq, minFont, maxFont) {
	return function(frequency) {
		return ((maxFont - minFont) / Math.pow((maxFreq - minFreq), 2)) * Math.pow((frequency - minFreq), 2) + minFont;
	}
}

// a * sqrt(b(x+c)) + d, with b = 1
function sqrtScaleFunction(minFreq, maxFreq, minFont, maxFont) {
	return function(frequency) {
		return ((maxFont - minFont) / Math.sqrt(maxFreq - minFreq)) * Math.sqrt(frequency - minFreq) + minFont;
	}
}

// a * log(b(x+c)) + d, with b = 1
function logScaleFunction(minFreq, maxFreq, minFont, maxFont) {
	return function(frequency) {
		// log(0) NaN avoid
		return ((maxFont - minFont) / Math.log(maxFreq - minFreq)) * Math.log((frequency + 1) - minFreq) + minFont;
	}
}
