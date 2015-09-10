
import BaseShape from "js/visualization/shape/BaseShape";
import ShapeRect from "js/visualization/shape/ShapeRectangular";
import ShapeCircle from "js/visualization/shape/ShapeCircle";

export default class ShapeParameters {
	constructor() {
		this._shapeConstructor = ShapeRect;
		this._fillSpace = false;
		this._placeAllWords = false;
		this._centrateWords = false;
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

	get shapeConstructor() {
		return this._shapeConstructor;
	}

	set shapeConstructor(shapeConstructor) {
		this._shapeConstructor = shapeConstructor;
	}

	get centrateWords() {
		return this._centrateWords;
	}

	set centrateWords(centrateWords) {
		this._centrateWords = centrateWords;
	}

	static get centrateWordsPath() {
		return "centrateWords";
	}

	static get fillSpacePath() {
		return "fillSpace";
	}

	static get placeAllWordsPath() {
		return "placeAllWords";
	}
}
