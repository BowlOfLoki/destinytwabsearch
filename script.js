/* Main functions loading most functions - */
	/* Start - split into different functions like original python scripts*/





twabIds = {};

async function onLoadEvent() {
	await twabFinder().then(function(response) {
		twabIds = response;
	})
	await htmlOuter(twabIds).then(function(twabs) {
		twabIds = twabs;
		console.log('done')
	})

	let elements = document.querySelectorAll(".searchForm");
	for (let i=0; i<elements.length; i++){
		elements[i].style.visibility = "visible";
	}

	removeElement("loader")

	let form = document.getElementById("searchform");
	form.addEventListener('submit', formSubmit)
}

function formSubmit(event) {
	event.preventDefault();
	console.log(document.getElementById("searchTerm").value);
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

function hideHtml(id, state) {
	if (state) {
		document.getElementById(id).style.visibility = "hidden";
	} else {
		document.getElementById(id).style.visibility = "visible";
	}

}

	/* Clears text of characters that will ruin formatting when used in html */
function sanitiseText(text) {
	return text.replace("\xa0","").replace("\n"," ").replace("<div>","").replace("</div>","").replace("<p>","").replace("</p>","").replace("<ul>","").replace("</ul>","");
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
	return htmlObj;
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