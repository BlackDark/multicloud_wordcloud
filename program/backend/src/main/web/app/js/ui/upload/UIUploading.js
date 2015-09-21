import UIHelper from "../visualization/shape/UIHelper";

const FILE_EXTENSIONS = '.txt';
const MAX_SIZE = 1024; // KB
const FILE_TYPE_ERROR_MESSAGE = 'Currenlty only following file types are allowed:<br/> <strong>' + FILE_EXTENSIONS + '</strong>';
const FILE_SIZE_ERROR_MESSAGE = 'Currently only the following max size of all files together is allowed：<br/> <strong>' + MAX_SIZE + '</strong> KB.';

export default class UIUploading {
	constructor() {
		this.displayedElements = 0;
		this.selectedId = undefined;

		this._initateParameters();
		this._applyListeners();
		this._initPolling();
	}

	static getInputFileLabel(name, dataValue) {
		return "<div class='ui label' data-value='" + dataValue + "'><i class='file text icon'></i>" + name + "</div>";
	}

	static getInputTableFileLabel(name) {
		return "<div class='ui label'>   <i class='file text icon'></i>" + name + "</div>";
	}

	get selectedRow() {
		return this.selectedId;
	}

	_applyListeners() {
		var that = this;

		let cleanData = {
			parameters: {}
		};

		let extraData = {
			parameters: {}
		};

		$("#file-4").fileinput({
			uploadUrl: 'uploadMulti',
			uploadExtraData: extraData,
			uploadAsync: false,
			dropZoneEnabled: false,
			allowedFileTypes: ["text"],
			minFileCount: 2,
			maxFileCount: 20,
			maxFileSize: 5000,
			showUploadedThumbs: false,
			allowedPreviewTypes: [],
			previewSettings: {
				text: {width: "50px", height: "30px"},
				object: {width: "50px", height: "30px"},
				other: {width: "50px", height: "30px"}
			},
			layoutTemplates: {
				actionUpload: ''
			}
		}).on('filebatchuploadcomplete', function (event, data, id, index) {
			that._pollOnceForResources();
			extraData = cleanData;
		}).on('filepreajax', function (event, previewId, index) {
			extraData.parameters.stopwords = that._getStopWords();
			extraData.parameters = JSON.stringify(extraData.parameters);
		});
		$('#upload-parameters').accordion();
	}

	_initPolling() {
		let that = this;

		(function requestAvailableResources() {
			$.ajax({
				url: "upload/availableResources",
				type: "GET",
				success: function (data) {
					that.displayedElements = that._updateResourceTable(data, that.displayedElements);
				},
				dataType: "json",
				complete: setTimeout(function () {
					requestAvailableResources()
				}, 3000),
				timeout: 2000
			})
		})();
	}

	_pollOnceForResources() {
		let that = this;

		$.ajax({
			url: "upload/availableResources",
			type: "GET",
			success: function (data) {
				that.displayedElements = that._updateResourceTable(data, that.displayedElements);
			},
			dataType: "json"
		});
	}

	_addTableRow(fileNames, id, isFinished) {
		var tr = d3.select("#uploadTableBody").append("tr");

		let label = "";
		fileNames.forEach(name => label = label.concat(UIUploading.getInputTableFileLabel(name)));
		tr.append("td").html(label);
		tr.append("td").attr("class", "center aligned").attr("id", "dataId").html(id);

		console.log(isFinished);

		if(isFinished) {
			tr.append("td").attr("class", "center aligned").html("<i class='check circle icon green'></i>");
		} else {
			tr.append("td").attr("class", "center aligned").html("<i class='remove circle icon red'></i>");
		}
	}

	_updateResourceTable(jsonData, displayedElements) {
		var that = this;

		if (jsonData.length === 0) {
			$('#uploadResourceEmpty').removeClass('hidden');
			$('#uploaedResource').addClass('hidden');
			return 0;
		}

		if (displayedElements === jsonData.length) {
			return displayedElements;
		}

		$('#uploadResourceEmpty').addClass('hidden');
		$('#uploaedResource').removeClass('hidden');

		var tableBody = d3.select("#uploadTableBody");
		tableBody.selectAll("*").remove();

		for (var i = 0; i < jsonData.length; i++) {
			that._addTableRow(jsonData[i].fileNames, jsonData[i].id, jsonData[i].isFinished);
		}


		$('#uploadTableBody').find('tr').click(function () {
			var newId = +$(this).find('td#dataId').text();

			if (that.selectedId === newId) {
				return;
			}

			if (that.selectedId !== undefined) {
				$($('#uploadTableBody').find('tr')[that.selectedId]).removeClass('selectedUpload');
			}

			$(this).addClass('selectedUpload');

			that.selectedId = newId;
		});

		return jsonData.length;
	}

	_initateParameters() {
		$.ajax({
			url: "upload/parameters",
			type: "GET",
			success: function (data) {
				setUploadParameters(data);
			},
			error: function (error, data) {

			}
		})
	}

	_getStopWords() {
		if (d3.select('#upload-parameters').select("textarea").node() === null) {
			return "";
		}

		let stopwords = d3.select('#upload-parameters').select("textarea").property("value");

		return stopwords.split(", ");
	}
}

function setUploadParameters(jsonData) {
	let divContent = d3.select('#upload-parameters').select("div.content");
	addStopWords(jsonData, divContent);
}

function addStopWords(data, divContent) {
	let stopwordContainer = document.createElement("div");
	d3.select(stopwordContainer).attr("class", "ui segment container").append("h3").text("Stopword list");



	let gridDiv = document.createElement("div");
	let modeDiv = document.createElement("div");
	let textContentDiv = document.createElement("div");
	let textDiv = document.createElement("div");

	d3.select(textDiv).attr("class", "ui container");

	let bootstrapDiv = document.createElement("div");
	d3.select(bootstrapDiv).attr("class", "bootstrap-isolated form-group");
	let textAreaInput = document.createElement("textarea");
	d3.select(textAreaInput).attr("class", "form-control").attr("rows", 5).attr("id", "commentStopWord");

	let defaultRadio = UIHelper.getRadioButton("stopword", false, "Default list", undefined);
	let longRadio = UIHelper.getRadioButton("stopword", false, "Long list", undefined);
	let radioGroup = UIHelper.getRadioGroup([defaultRadio, longRadio], 0);

	d3.select(defaultRadio).select("input").on("change", function () {
		if (this.checked) {
			d3.select(textAreaInput).property("value", data.defaultStopwords.join(", "));
		}
	});

	d3.select(longRadio).select("input").on("change", function () {
		if (this.checked) {
			d3.select(textAreaInput).property("value", data.longStopwords.join(", "));
		}
	});


	modeDiv.appendChild(radioGroup);

	d3.select(textAreaInput).property("value", data.defaultStopwords.join(", "));

	let selectedGrid = d3.select(gridDiv).attr("class", "ui grid container");
	let selectedMode = d3.select(modeDiv).attr("class", "four wide column");
	let selectedText = d3.select(textContentDiv).attr("class", "twelve wide column");
	bootstrapDiv.appendChild(textAreaInput);
	textDiv.appendChild(bootstrapDiv);
	textContentDiv.appendChild(textDiv);

	gridDiv.appendChild(modeDiv);
	gridDiv.appendChild(textContentDiv);
	stopwordContainer.appendChild(gridDiv);

	divContent.node().appendChild(stopwordContainer);
}
