export default class UIUploading {
	constructor() {
		this.fileExtentionRange = '.txt';
		this.MAX_SIZE = 1024; // KB
		this.displayedElements = 0;
		this.selectedId = undefined;

		this._applyListeners();
		this._initPolling();
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
				$('#attachmentName').removeAttr('name');
				$('#submitUpload').attr('disabled', true);
				$('#_attachmentName').val("");
				return;
			}

			$('#submitUpload').removeAttr('disabled');
			$('#_attachmentName').val(fileNames.join(" - "));
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
					var tr = d3.select("#uploadTableBody").append("tr");
					var fileNames = "";
					var files = $('#filesInput').prop("files");

					for (var i = 0; i < files.length; i++) {
						var file = files.item(i);
						fileNames = fileNames.concat(" | " + file.name);
					}

					tr.append("td").text(fileNames);
					tr.append("td").text(data);
					console.log(data);
				}
			});
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

			if (that.fileExtentionRange.indexOf(postfix.toLowerCase()) > -1) {

			} else {
				alert('file type：<br/> <strong>' + that.fileExtentionRange + '</strong>');
				return false;
			}

			fileNames.push(file.name);
		}

		if (size > 1024 * that.MAX_SIZE) {
			alert('max size：<strong>' + that.MAX_SIZE + '</strong> MB.');
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
			var tr = tableBody.append("tr");
			tr.append("td").text(jsonData[i].fileNames.join(" - "));
			tr.append("td").text(jsonData[i].id);
		}


		$('#uploadTableBody').find('tr').click(function () {
			var newId = +$(this).find('td').last().text();

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
