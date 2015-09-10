
const FILE_EXTENSIONS = '.txt';
const MAX_SIZE = 1024; // KB
const FILE_TYPE_ERROR_MESSAGE = 'Currenlty only following file types are allowed:<br/> <strong>' + FILE_EXTENSIONS + '</strong>';
const FILE_SIZE_ERROR_MESSAGE = 'Currently only the following max size of all files together is allowed：<br/> <strong>' + MAX_SIZE + '</strong> KB.';

export default class UIUploading {
	constructor() {
		this.displayedElements = 0;
		this.selectedId = undefined;

		this._applyListeners();
		this._initPolling();
	}

	static getInputFileLabel(name, dataValue) {
		return "<div class='ui label' data-value='" + dataValue + "'><i class='file text icon'></i>" + name + "</div>";
	}

	static getInputTableFileLabel(name) {
		return "<div class='ui label'>   <i class='file text icon'></i>" + name + "</div>";
	}

	_getModalDiv(message) {
		let modal = document.createElement('div');
		$(modal).addClass('ui').addClass('modal');
		$(modal).append("	<i class='close icon'></i> 	<div class='header'> 	</div> </div>  <div class='ui modal' id='wrongFileSize'> 	<i class='close icon'></i> 	<div class='header'> 	</div>");

		$(modal).find('div.header').append(message);
		return $(modal);
	}

	get selectedRow() {
		return this.selectedId;
	}

	_applyListeners() {
		var that = this;

		$("#attachmentName").change(function () {
			var fileList = $(this)[0].files;

			let fileNames = that._checkInput(fileList, that);

			if(fileNames === false) {
				let fileInput = $('#attachmentName');
				fileInput.replaceWith(fileInput = fileInput.clone(true));
				$('#submitUpload').attr('disabled', true);
				$('#fileLabelDiv').empty();
				return;
			}

			$('#submitUpload').removeAttr('disabled');
			let fileLabels = "";
			fileNames.forEach(name => fileLabels = fileLabels.concat(UIUploading.getInputFileLabel(name, name)));
			$('#fileLabelDiv').empty();
			$('#fileLabelDiv').append(fileLabels);
		});

		$("#checkFinish").click(function () {
			var id = +$("#progressId").prop("value");
			$.ajax({
				url: "upload/" + id + "/progress",
				success: function (data) {
					console.log(data);
				}
			});
		});

		$("#printResult").click(function () {
			var id = +$("#progressId").prop("value");

			$.ajax({
				url: "upload/" + id + "/result",
				success: function (data) {
					console.log(data);
				}
			});
		});

		$("#submitUpload").click(function () {
			event.preventDefault();
			var data = new FormData($('#filesForm')[0]);
			console.log(data);

			$.ajax({
				url: 'uploadMulti',
				type: 'post',
				dataType: 'json',
				contentType: false,
				processData: false,
				data: data,
				success: function (data) {
					$('#fileLabelDiv').empty();
					that._pollOnceForResources();
				}
			});
		});

		$("#file-4").fileinput({
			uploadUrl: '/uploadMulti/',
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
		});
	}

	_checkInput(fileList, that) {
		var fileNames = [];
		var size = 0;

		if(fileList.length === 0) {
			return false;
		}

		for (var i = 0; i < fileList.length; i++) {
			var file = fileList.item(i);
			size += file.size;

			var postfix = file.name.substr(file.name.lastIndexOf('.'));

			if (FILE_EXTENSIONS.indexOf(postfix.toLowerCase()) > -1) {

			} else {
				that._getModalDiv(FILE_TYPE_ERROR_MESSAGE).modal('show');
				return false;
			}

			fileNames.push(file.name);
		}

		if (size > 1024 * MAX_SIZE) {
			that._getModalDiv(FILE_SIZE_ERROR_MESSAGE).modal('show');
			return false;
		}

		return fileNames;
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
}
