async function onLoadEvent() {
    let destinyData = {};
    let aggregateUrl = "https://www.bungie.net"
    await bungieGetAggregateUrl().then(function(response) {
        aggregateUrl += response.Response.jsonWorldContentPaths.en
    });
    console.log(aggregateUrl)

    await apiRequest(aggregateUrl).then(function(response) {
        destinyData['DestinyInventoryItemDefinition'] = response.DestinyInventoryItemDefinition;
        destinyData['DestinyPowerCapDefinition'] = response.DestinyPowerCapDefinition;
        destinyData['DestinySandboxPerkDefinition'] = response.DestinySandboxPerkDefinition;
        destinyData['DestinyStatDefinition'] = response.DestinyStatDefinition;
    });


    weapons = {}
    for (let i in destinyData.DestinyInventoryItemDefinition) {
        for (let b in destinyData.DestinyInventoryItemDefinition[i]['traitIds']) {
            if (destinyData.DestinyInventoryItemDefinition[i]['itemType'] === 3) {
                let currentVers = destinyData.DestinyInventoryItemDefinition[i]['quality']['currentVersion'];
                let powerCapHash = destinyData.DestinyInventoryItemDefinition[i]['quality']['versions'][currentVers]['powerCapHash'];
                let powerCap = destinyData.DestinyPowerCapDefinition[powerCapHash]['powerCap']
                weapons[i] = destinyData.DestinyInventoryItemDefinition[i];
            }       
        }
    }
    console.log(weapons);
    destinyData['DestinyInventoryItemDefinition'] = weapons;
    


    const searchContainer = document.createElement('div')
    searchContainer.setAttribute('class', 'searchContainer')


    const searchBar = document.createElement('div')
    const searchEl = document.createElement("input")
    searchEl.oninput = onSearchInput
    searchEl.setAttribute('class', 'search')
    searchEl.setAttribute('id', 'search')
    searchBar.appendChild(searchEl)
    searchBar.setAttribute('class', 'searchBar')
    searchContainer.appendChild(searchBar)    
    searchContainer.appendChild(getSearchedWeapons())
    document.body.append(searchContainer);

    const displayWeapon = document.createElement('div');
    displayWeapon.setAttribute('class', 'weaponDisplay');
    displayWeapon.setAttribute('id', 'weapon');
    document.body.append(displayWeapon);
}

async function gunPress(event) {
    let replaceEl = document.getElementsByClassName('clicked')
    for (let i in replaceEl) {
        target = replaceEl[i].id
        if (target !== undefined) {
            document.getElementById(target).setAttribute('class', 'weaponNode')
        }
    }
    document.getElementById(event.target.id).setAttribute('class', 'clicked')
    let displayWeapon = document.getElementById('weapon')
    displayWeapon.innerHTML = JSON.stringify(weapons[event.target.id])
}

function getSearchedWeapons(searchString) {
    const lineBreak = document.createElement("br")
    const searchResults = document.createElement("div");
    searchResults.setAttribute('class', 'searchResults')
    searchResults.setAttribute('id', 'searchResults')
    for (let i in weapons) {
        if (searchString === undefined || (weapons[i]['displayProperties']['name'].toLowerCase()).includes(searchString.toLowerCase())){

            const result = document.createElement("div");
            result.setAttribute('id', i);
            result.setAttribute('class', 'weaponNode');
            const imageDiv = document.createElement("div");
            imageDiv.setAttribute('class', 'parentImage')

            weaponImg = document.createElement('img')
            weaponImg.setAttribute('class', 'weaponImage')

            weaponImg.src = "https://www.bungie.net" + weapons[i]['displayProperties']['icon']
            imageDiv.appendChild(weaponImg)
            result.appendChild(imageDiv)
            result.onclick = gunPress
            const text = document.createTextNode(weapons[i]['displayProperties']['name']);
            result.appendChild(text)
            result.appendChild(lineBreak)
            searchResults.appendChild(result);
        }
    }
    return searchResults
}

function onSearchInput(event) {
    const replacement = getSearchedWeapons(document.getElementById('search').value);
    document.getElementById('searchResults').innerHTML = replacement.innerHTML;
}


function apiRequest(url) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    return new Promise(function(resolve, reject) {
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let json = JSON.parse(this.responseText);
                resolve(json);
            } else {
                resolve.onerror = reject;
            }
        }
        request.send();
    });
}

function bungieGetAggregateUrl() {
    const apiKey = "f964b21004ec4b688c3bfd113638b260";
    let url = "https://www.bungie.net/Platform/Destiny2/Manifest/";
    let request = new XMLHttpRequest();
    request.open("GET", url, true)

    request.setRequestHeader("X-API-Key", apiKey);
    return new Promise(function(resolve, reject) {
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let json = JSON.parse(this.responseText);
                resolve(json);
            } else {
                resolve.onerror = reject;
            }
        }
        request.send();
    });

}