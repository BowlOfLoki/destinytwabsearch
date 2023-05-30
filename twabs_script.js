/* Main functions loading most functions - */
	/* Start - split into different functions like original python scripts*/





twabIds = {};



async function onLoadEvent() {
	
	document.getElementById("Loader").innerHTML = "Getting All Twabs";
	await twabFinder().then(function(response) {
		twabIds = response;
	})
	let elements = document.querySelectorAll(".searchForm");
	for (let i=0; i<elements.length; i++){
		elements[i].style.visibility = "visible";
	}

	removeElement("Loader")
	
	let form = document.getElementById("searchform");
	form.addEventListener('submit', formSubmit)
	await hashDealing();	
}

function hashDealing() {
	if (window.location.hash) {
		var hash = window.location.hash.substring(0);
		document.getElementById("searchTerm").value = hash.substring(1, hash.length).replace(/\+/g, " ");
		let button = document.getElementById("inputButton");
		button.click();
	}
	
}

async function formSubmit(event) {
	htmlText = "";
	event.preventDefault();
	let searchTerm = document.getElementById("searchTerm").value.toLowerCase();
	console.log(searchTerm);
	console.log(twabIds);
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
				let twabName = twabIds[id]['title'];

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

				htmlText += "<h1><strong>{amount} in <a href=\"{link}\"> {twabName}</a></strong></h1>".replace("{twabName}", twabName).replace("{twabId}", id).replace("{amount}", response[id][0]).replace("{link}", "https://www.bungie.net" + twabIds[id]['link']);
				for (let sent in response[id][1]) {
					totalApps += 1;
					let current = response[id][1][sent];
					let coolSearchRegex = new RegExp(searchTerm, "gi")
					let sentence = "<a>" + sanitiseText(twabIds[id]['html'].substring(current[0],current[1]), coolSearchRegex, searchTerm) + "</a>";
					htmlText += sentence;

				}
			}
			let cooltext = "<div> <h1>Searched: " + searchTerm +"</h1> <p>" + totalApps + " appearances, " + uniqueApps + " unique appearances out of " + numberTwabs + "</p>" +
				"<p><a href=\"{link}\">".replace("{link}", "https://www.bungie.net" + twabIds[most[0]]['link']) + " " + twabIds[most[0]]['title'] + "</a> has " + most[1] + " appearances</p>" +
				"<p>First occurred: <a href=\"{link}\">".replace("{link}", "https://www.bungie.net" + twabIds[first[0]]['link']) + twabIds[first[0]]['title'] + "</a><br> " +
				" Most recently appeared: <a href=\"{link}\">".replace("{link}", "https://www.bungie.net" + twabIds[recent[0]]['link']) + twabIds[recent[0]]['title'] + "<a></p></div>"
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
	let request = new XMLHttpRequest();
	request.open("GET", url, true);
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
	return year+month+day;
}

	/* Clears text of characters that will ruin formatting when used in html */
function sanitiseText(text, regex, searchTerm) {
	let replacement = "<b>" + searchTerm.toUpperCase() +"</b>";
	let newText = text.replace(/<.*?>/g,"").replace(/\xa0/, "").replace(/\n/gi,"").replace(regex, replacement);
	return newText;
}



/* Main Functions */
	/* twab finder - finds twab ids {id: [name, date]}*/
async function twabFinder(){
	entries = {};
	let url = "https://raw.githubusercontent.com/BowlOfLoki/lokisdestinydata/master/twabsDict.json";
	await apiRequest(url).then(function(response) {
		for (let i in response){
			entries[i] = response[i];
		}
	});
	console.log(entries)
	return entries;
}


async function searchFunction(twabIds, searchTerm) {
	usedTwabs = {};
	for (let twabId in twabIds) {
		let twab = {};
		twab[twabId] = twabIds[twabId];
		indivTwabSearch(twab, twabId, searchTerm).then(function (response) {
			if (!(response === false)) {
				response.push(twab[twabId]['date']);
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
		if (twab[id]['html'].toLowerCase().includes(searchTerm)) {
			let regex = new RegExp(searchTerm,"gi")
			let result;
			while ( (result=regex.exec(twab[id]['html'])) ) {
				let sentence = getSentence(twab[id]['html'], result.index);
				if ((sentence)) {
					sentences.push(sentence);
					count += 1;
				}
			}
		} else {
			return false;
		}
		console.log(sentences)
		let info = [];
		if (sentences.length >= 2) {
			for (let pair in sentences) {
				let allow = true;
				if (info.length >= 1) {
					for (let entr in info) {
						if (info[entr][1] >= sentences[pair][0]) {
							allow = false;
						}
					}
				}
				if (allow === true) {
					info.push(sentences[pair]);
				}
			}
		} else {
			info = sentences;
		}
		console.log(count)
		return [count, info];
	} catch (err) {
		return false;
	}
	return false;
}