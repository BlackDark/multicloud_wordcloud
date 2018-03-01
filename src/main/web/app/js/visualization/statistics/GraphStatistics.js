export default class GraphStatistics {
	constructor(graph) {
		this._graph = graph;
	}

	get maxFont() {
		return this._biggestWord.getSize();
	}

	get minFont() {
		return this._smallestWord.getSize();
	}

	updateStats() {
		this._fontChecking();
	}

	_fontChecking() {
		let small = undefined;
		let big = undefined;

		this._graph._textNodes.forEach(element => {
			if (small === undefined || small.getFrequency() > element.getFrequency()) {
				small = element;
			}

			if (big === undefined || big.getFrequency() < element.getFrequency()) {
				big = element;
			}
		});

		this._biggestWord = big;
		this._smallestWord = small;
	}
}
