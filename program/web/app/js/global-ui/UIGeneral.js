$(document).ready(function(){
	// For tabbing
	$('.menu .item')
		.tab({
			onFirstLoad: function(tabName) {

				// Load visualization scripts first on tab opening
				if(tabName === "visualization") {
					var test = require("js/app");
					//test.executeSample();
					$.ajax({
						url: "/upload/" + 0 + "/result",
						success: function(data) {
							test.execute(data);
						}
					});
				}
			}
		});
});

