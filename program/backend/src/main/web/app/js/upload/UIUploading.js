$(document).ready(function () {
	$("#checkFinish").click(function () {
		var id = +$("#progressId").prop("value");
		$.ajax({
			url: "upload/" + id + "/progress",
			success: function(data) {
				console.log(data);
			}
		});
	});

	$("#printResult").click(function () {
		var id = +$("#progressId").prop("value");

		$.ajax({
			url: "upload/" + id + "/result",
			success: function(data) {
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
			success: function(data) {
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
	})
});


