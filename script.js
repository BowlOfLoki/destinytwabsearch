/* Main functions loading most functions - */
	/* Start - split into different functions like original python scripts*/
function onLoadEvent() {
	return null;
}

/* function for testing anything I need */
function testFunc() {
	var array = [1,2,3,4];
	for (let x in array) {
		console.log(array[x])
	}
	console.log("pressed")
	twabFinder()
	return null;
}
/* General Use functions */
	/* Used for all api requests so no repeated code is used */
function apiRequest(url) {
	var apiKey = "f964b21004ec4b688c3bfd113638b260";

	var request = new XMLHttpRequest();
	request.open("GET", "https://www.bungie.net/platform/Destiny/Manifest/InventoryItem/1274330687/", true);
	request.setRequestHeader("X-API-Key", apiKey);

	request.onreadystatechange = function(){
		if(this.readyState === 4 && this.status === 200){
			var json = JSON.parse(this.responseText);
			console.log(JSON.stringify(json));
		}
	}
	request.send();
}
	/* Clears text of characters that will ruin formatting when used in html */
function sanitiseText(text) {
	let result = text.replace("\xa0","").replace("\n"," ").replace("<div>","").replace("</div>","").replace("<p>","").replace("</p>","").replace("<ul>","").replace("</ul>","");
	console.log(result);
	return result;
}


function fileExist(url) {
	if (url) {
		var req = new XMLHttpRequest();
		req.open('GET', url, false);
		req.send();
		return req.status==200;
	} else {
		return false;
	}
}

/* Main Functions */
	/* twab finder - finds twab ids*/
function twabFinder(){
	let page = 0;
	let entries = [];
	var cont = true;
	var array = ["News", "Updates"];
	for (let type in array) {
		console.log(array[type])
		while (cont === true) {
			let url = "https://www.bungie.net/Platform/Trending/Categories/{type}/{page}/".replace("{page}",page).replace("{type}",array[type])
			let data = apiRequest(url);
			break;
		}
	}
}
