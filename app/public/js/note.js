
window.onload = function() {
	updateFieldSizes();


}
	function updateFieldSizes() {
		var things = document.getElementsByTagName('textarea');
		for (var i = 0; i < things.length; ++i) {
			var item = things[i];
			console.log(item.scrollHeight);
			item.style.height = item.scrollHeight - 39 + 'px';
		}
	}