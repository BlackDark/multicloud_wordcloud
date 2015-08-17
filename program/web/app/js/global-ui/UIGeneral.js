$(document).ready(function(){
	// For tabbing
	$('.menu .item')
		.tab({
			onFirstLoad: function(tabName) {

				// Load visualization scripts first on tab opening
				if(tabName === "visualization") {
					require("js/app");
				}
			}
		});
});

