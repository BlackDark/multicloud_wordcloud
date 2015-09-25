
import UIHelper from "../shape/UIHelper";

export default class UIUploadParameters {
	constructor(uiViz, containerQuerySelector, graphObject) {
		this._uiViz = uiViz;
		this._topContainer = containerQuerySelector;
		this._topContainerD3Selector = d3.select(this._topContainer[0]);
		this._container = this._topContainerD3Selector.append("div").attr("class", "ui segment container");
		this._graphObject = graphObject;
		this._numIntersectionWords = 200;
		this._numDocumentWords = 20;

		this._addToLayout();
	}

	_addToLayout() {
		let that = this;
		this._container.append("h2")
			.attr("class", "ui header")
			.text("Document information");

		this._itemContainer = this._container.append("div").attr("class", "ui items");

		this._totalNumWords = d3.select(document.createElement("div")).text(0);

		this._inputNumWords = UIHelper.getInputNumberDom("numWords", "Number of words...", undefined, false);
		$(this._inputNumWords).change(function() {
			that._numIntersectionWords = getInputValue(this);
			that.updateGraph();
		});

		this._inputNumDocWords = UIHelper.getInputNumberDom("numDocWords", "Number of words...", that._numDocumentWords, false);
		$(this._inputNumDocWords).change(function() {
			that._numDocumentWords = getInputValue(this);
			that.updateGraph();
		});
		//this._itemContainer.append("div").attr("class", "item").node().appendChild(this._inputNumWords);

		this._itemContainer.append("div").attr("class", "item").node().appendChild(UIHelper.getTable(
			[
				{
					clazz: "three wide",
					text: "Value"
				},
				{
					text: "Description"
				}
			],
			[
				[
					{
						clazz: "three wide right aligned",
						content: this._totalNumWords.node()
					},
					{
						clazz: "three wide",
						text: "Total number of different words in all documents."
					}
				],
				[
					{
						clazz: "three wide right aligned",
						content: this._inputNumWords
					},
					{
						clazz: "three wide",
						text: "Number of the displayed most frequent words of the corpora."
					}
				],
				[
					{
						clazz: "three wide right aligned",
						content: this._inputNumDocWords
					},
					{
						clazz: "three wide",
						text: "Number of the displayed most frequent words of the each document. Not guaranteed that desired number will be get for every document."
					}
				]
			],
			{
				theadClazz: ""
			}
		));
	}

	updateNumWords(numWords) {
		$('input[name="numWords"]').val(+numWords);
	}

	updateTotalNumWords(numWords) {
		$(this._totalNumWords.node()).text(+numWords);
	}

	updateGraph() {
		let that = this;
		$.ajax({
			url: "upload/" + that._graphObject.currentId + "/numWords",
			type: 'POST',
			data: {
				"numWords": that._numIntersectionWords,
				"numDocumentWords": that._numDocumentWords
			},
			success: function (response) {
				that._uiViz.updateVisualization(response);
			},
			error: function () {
				alert("error");
			}
		});
	}
}

function getInputValue(divInput) {
	return +$(divInput).find("input").val();
}
