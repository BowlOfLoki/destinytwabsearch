/* Main functions loading most functions - */
	/* Start - split into different functions like original python scripts*/





twabIds = {};

async function onLoadEvent() {
	await twabFinder().then(function(response) {
		twabIds = response;
	})
	await htmlOuter(twabIds).then(function(twabs) {
		twabIds = twabs;
	})
	let elements = document.querySelectorAll(".searchForm");
	for (let i=0; i<elements.length; i++){
		elements[i].style.visibility = "visible";
	}

	removeElement("loader")

	let form = document.getElementById("searchform");
	form.addEventListener('submit', formSubmit)
}

async function formSubmit(event) {
	htmlText = "";
	event.preventDefault();
	let searchTerm = document.getElementById("searchTerm").value.toLowerCase();
	await searchFunction(twabIds, searchTerm).then(function (response) {
		if (Object.keys(response).length > 0){
			totalApps = 0;
			uniqueApps = 0;
			most = ["", 0];
			first = ["", 99999999999];
			recent = ["", 0];
			numberTwabs = Object.keys(twabIds).length;


			let items = Object.keys(response).map(function (key) {
				return [key, response[key][2]]
			})
			items.sort(function(first, second) {
				return second[1] - first[1];
			})
			for (let x in items) {
				uniqueApps += 1;
				let id = items[x][0];
				let twabName = twabIds[id][0];

				if (response[id][0] > most[1]) {
					most[0] = id;
					most[1] = response[id][0];
				}

				if (items[x][1] < first[1]) {
					first[0] = id;
					first[1] = items[x][1];
				}

				if (items[x][1] > recent[1]) {
					recent[0] = id;
					recent[1] = items[x][1];
				}

				htmlText += "<h1><strong>{amount} in <a href=\"https://www.bungie.net/en/Explore/Detail/News/{twabId}\"> {twabName}</a></strong></h1>".replace("{twabName}",twabName).replace("{twabId}",id).replace("{amount}", response[id][0]);
				for (let sent in response[id][1]) {
					totalApps += 1;
					let current = response[id][1][sent];
					let coolSearchRegex = new RegExp(searchTerm, "gi")
					let sentence = "<a>" + sanitiseText(twabIds[id][2].substring(current[0],current[1]), coolSearchRegex, searchTerm) + "</a>";
					htmlText += sentence;

				}
			}
			let cooltext = "<div> <h1>Searched: " + searchTerm +"</h1> <p>" + totalApps + " appearances, " + uniqueApps + " unique appearances out of " + numberTwabs + "</p>" +
				"<p><a href=\"https://www.bungie.net/en/Explore/Detail/News/{mostId}\">".replace("{mostId}", most[0]) + " " + twabIds[most[0]][0] + "</a> has " + most[1] + " appearances</p>" +
				"<p>First occurred: <a href=\"https://www.bungie.net/en/Explore/Detail/News/" + first[0] + "\">" + twabIds[first[0]][0] + "</a><br> " +
				" Most recently appeared: <a href=\"https://www.bungie.net/en/Explore/Detail/News/" + recent[0] +"\">" + twabIds[recent[0]][0] + "<a></p></div>"
			htmlText += cooltext;
		} else {
			htmlText = "Could not find queried search"
		}


	});
	document.getElementById('searched').innerHTML = htmlText
	return false;
}



/* General Use functions */
	/* Used for all api requests so no repeated code is used */
function apiRequest(url) {
	let apiKey = "f964b21004ec4b688c3bfd113638b260";
	let request = new XMLHttpRequest();

	request.open("GET", url, true);
	request.setRequestHeader("X-API-Key", apiKey);
	return new Promise(function(resolve, reject) {
		request.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				let json = JSON.parse(this.responseText);
				resolve(json)
			} else {
				resolve.onerror = reject;
			}
		}
		request.send();
	});
}


function removeElement(className) {
	const elements = document.getElementsByClassName(className);
	while(elements.length > 0) {
		elements[0].parentNode.removeChild(elements[0])
	}
}

function getSentence(twab, location) {
	let start = -1;
	let end = -1;
	if ( twab.substring(0,location).lastIndexOf("<div>") > twab.substring(0,location).lastIndexOf("<ul>") || twab.substring(0,location).lastIndexOf("<div>") > location-400 ) {
		start = twab.substring(0,location).lastIndexOf("<div>");
		end = twab.substring(location, twab.length-1).indexOf("</div>")
	} else {
		start = twab.substring(0,location).lastIndexOf("<ul>");
		end = twab.substring(location, twab.length-1).indexOf("</ul>")
	}
	if (start === -1) {
		start = 0;
	}
	if (end === 0) {
		end = twab.length-1;
	}
	return [start, end+location]
}

function timeConv(timeStr) {
	let bTime = timeStr.substring(0,10);
	let year = parseInt(bTime.substring(0,4))*365*24;
	let month = parseInt(bTime.substring(5,7))*30*24;
	let day = parseInt(bTime.substring(8,10))*24;
	let unix = year+month+day;
	return unix;
}

	/* Clears text of characters that will ruin formatting when used in html */
function sanitiseText(text, regex, searchTerm) {
	let exitDiv = new RegExp("</div>", "gi")
	let exitP = new RegExp("</p>", "gi")
	let exitUl = new RegExp("</ul>", "gi")
	let replacement = "<b>" + searchTerm.toUpperCase() +"</b>";
	let newText = text.replace(/\xa0/, "").replace(/\n/gi,"").replace(/<div>/gi,"").replace(exitDiv,"").replace(exitP,"").replace(exitUl,"").replace(/<p>/gi,"").replace(/<ul>/gi,"").replace(regex, replacement)
	return newText;
}



/* Main Functions */
	/* twab finder - finds twab ids {id: [name, date]}*/
async function twabFinder(){
	entries = {};
	contType = ["News", "Updates"];
	for (let type in contType) {
		let page = 0;
		continueLoop = true;
		while (true) {
			let url = "https://www.bungie.net/Platform/Trending/Categories/{type}/{page}/".replace("{page}",page).replace("{type}",contType[type])
			await apiRequest(url).then(function(response) {
				let resultList = response.Response.results;
				for (let i in resultList) {
					let id = resultList[i].identifier
					if (id in entries) {
					} else if (!(resultList[i].displayName.toLowerCase().includes("this week at bungie")) &&  resultList[i].displayName.toLowerCase().includes("destiny 2") && contType[type] === "Updates") {
						entries[id] = [resultList[i].displayName, resultList[i].creationDate];
					} else if (resultList[i].displayName.toLowerCase().includes("this week at bungie") && contType[type] === "News") {
						entries[id] = [resultList[i].displayName, resultList[i].creationDate.substring(0,10)];
					}
					if (response.Response.hasMore === false) {
						continueLoop = false;
					}
				}
			});
			page += 1;
			if (continueLoop === false) {
				break;
			}
		}
	}
	return entries;
}


async function htmlScrape(id){
	htmlObj = document.createElement('div');
	let url = "https://www.bungie.net/Platform/Trending/Details/News/{id}".replace("{id}", id);
	await apiRequest(url).then(function(response) {
		let content = response.Response.news.article.properties.Content;
		htmlObj.innerHTML = content;
		removeElement("twitter-tweet");
	})
	return htmlObj.outerHTML;
}

async function htmlOuter(twabIds) {
	number = 0;
	for (let id in twabIds) {
		htmlScrape(id).then(function(response) {
			twabIds[id].push(response);
			number += 1;
		})
	}
	return twabIds;
}


async function searchFunction(twabIds, searchTerm) {
	usedTwabs = {};
	for (let twabId in twabIds) {
		let twab = {};
		twab[twabId] = twabIds[twabId];
		indivTwabSearch(twab, twabId, searchTerm).then(function (response) {
			if (!(response === false)) {
				response.push(timeConv(twab[twabId][1]));
				usedTwabs[twabId] = response;
			}
		})
	}
	return usedTwabs;
}

/* sentence = [ position pair : [1, 3], position pair : [5, 8]]*/
async function indivTwabSearch(twab, id, searchTerm) {
	let count = 0;
	let sentences = [];
	try {
		if (twab[id][2].toLowerCase().includes(searchTerm)) {
			let regex = new RegExp(searchTerm,"gi")
			let result;
			while ( (result=regex.exec(twab[id][2])) ) {
				let sentence = getSentence(twab[id][2], result.index);
				sentences.push(sentence);
				count += 1;
			}
		} else {
			return false;
		}
		let info = {};
		return [count, sentences];
	} catch (err) {
		return false;
	}
	return false;
}