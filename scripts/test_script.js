var clicked = {};
var destinyData = {};
var meaning = ['weapon1text', 'weapon2text']

async function onLoadEvent() {
    let aggregateUrl = "https://www.bungie.net"
    await bungieGetAggregateUrl().then(function(response) {
        aggregateUrl += response.Response.jsonWorldContentPaths.en
    });

    await apiRequest(aggregateUrl).then(function(response) {
        destinyData = response;
    });
    console.log(destinyData);

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
    


    const searchContainer = document.createElement('div')
    searchContainer.setAttribute('class', 'searchContainer')
    searchContainer.setAttribute('id', 'searchContainer')


    const searchBar = document.createElement('div')
    const searchEl = document.createElement("input")
    const filter = document.createElement('img')
    filter.setAttribute('class', 'filterImg')
    filter.src = 'resources/FilterSettings.svg'
    searchBar.appendChild(filter)
    searchEl.oninput = onSearchInput
    searchEl.setAttribute('class', 'search')
    searchEl.setAttribute('id', 'search')
    searchBar.appendChild(searchEl)
    searchBar.setAttribute('class', 'searchBar')
    searchContainer.appendChild(searchBar)    
    searchContainer.appendChild(getSearchedWeapons())
    document.body.append(searchContainer);

    const displayWeapon = document.createElement('div');
    displayWeapon.setAttribute('class', 'displayContainer')
    displayWeapon.setAttribute('id', 'displayContainer')

    const displayOne = document.createElement('div');
    displayOne.setAttribute('class', 'weaponDisplay display1');
    displayOne.setAttribute('id', 'weapon1');

    const innerOne = document.createElement('div');
    innerOne.setAttribute('class', 'display1inner');
    innerOne.setAttribute('id', 'weapon1text');
    displayOne.appendChild(innerOne);

    displayWeapon.appendChild(displayOne);

    const moveBar = document.createElement('div')
    moveBar.setAttribute('class', 'inbetween')
    moveBar.setAttribute('id', 'inbetween')
    moveBar.addEventListener('mousedown', dragEvent);
    moveBar.addEventListener('dblclick', resetEvent);
    displayWeapon.appendChild(moveBar)

    const displayTwo = document.createElement('div')
    displayTwo.setAttribute('class', 'weaponDisplay display2');
    displayTwo.setAttribute('id', 'weapon2');

    const innerTwo = document.createElement('div')
    innerTwo.setAttribute('class', 'display2inner');
    innerTwo.setAttribute('id', 'weapon2text');
    displayTwo.appendChild(innerTwo)

    displayWeapon.appendChild(displayTwo)

    document.body.append(displayWeapon)
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
            
            
            if (weapons[i]['iconWatermark'] !== undefined) {
                const icon = document.createElement('img')
                icon.src = "https://www.bungie.net" + weapons[i]['iconWatermark']
                icon.setAttribute('class', 'iconImage')
                imageDiv.appendChild(icon);
            }
            result.appendChild(imageDiv)

            const clickable = document.createElement('div');
            clickable.onclick = gunPress
            clickable.setAttribute('class', 'frontDiv')
            clickable.setAttribute('id', i+'d')
            result.appendChild(clickable)

            const text = document.createElement('div')
            text.innerHTML = weapons[i]['displayProperties']['name'];
            text.setAttribute('class', 'weaponText')
            result.appendChild(text)
            result.appendChild(lineBreak)
            searchResults.appendChild(result);
        }
    }
    return searchResults
}

function onSearchInput(event) {
    const replacement = getSearchedWeapons(document.getElementById('search').value);
    document.getElementById('searchResults').replaceWith(replacement);
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

async function gunPress(event) {
    target = document.getElementById(event.target.id.substring(0, event.target.id.length - 1))
    if (Object.keys(clicked).length < 2) {
        if (Object.keys(clicked).length === 1) {
            const opposite = { 1: 2, 2: 1 }
            const usedKeys = Object.keys(clicked);
            clicked[opposite[usedKeys[0]]] = target.id;
        } else {
            clicked[Object.keys(clicked).length + 1] = target.id
        }
        renderClicked()
    }
}

function renderClicked() {
    try {
        document.getElementById('clickedWeapons').remove();
    } catch (err) {
    }
    for (let i in meaning) {
        document.getElementById(meaning[i]).innerHTML = "";
    }

    const searchResults = document.getElementById('searchResults');
    searchResults.style.marginTop = (Object.keys(clicked).length + 1) * 52;

    const clickedDiv = document.createElement('div');
    clickedDiv.setAttribute('class', 'clickedWeapons')
    clickedDiv.setAttribute('id', 'clickedWeapons')
    for (let idx in clicked) {
        let i = clicked[idx]
        const result = document.createElement("div");
        result.setAttribute('id', i + "c");
        result.setAttribute('class', 'clicked');
        const imageDiv = document.createElement("div");
        imageDiv.setAttribute('class', 'parentImage')

        weaponImg = document.createElement('img')
        weaponImg.setAttribute('class', 'weaponImage')

        weaponImg.src = "https://www.bungie.net" + weapons[i]['displayProperties']['icon']
        imageDiv.appendChild(weaponImg)


        if (weapons[i]['iconWatermark'] !== undefined) {
            const icon = document.createElement('img')
            icon.src = "https://www.bungie.net" + weapons[i]['iconWatermark']
            icon.setAttribute('class', 'iconImage')
            imageDiv.appendChild(icon);
        }
        result.appendChild(imageDiv)

        const clickable = document.createElement('div');
        clickable.onclick = clickedReclick
        clickable.setAttribute('class', 'frontDiv')
        clickable.setAttribute('id', idx)
        result.appendChild(clickable)

        const text = document.createElement('div')
        text.innerHTML = weapons[i]['displayProperties']['name'];
        text.setAttribute('class', 'weaponText')
        result.appendChild(text)
        clickedDiv.appendChild(result);
        const targetEle = document.getElementById(meaning[idx-1])
        weaponRender(weapons[i], targetEle)
    }
    const searchContainer = document.getElementById('searchContainer');
    searchContainer.appendChild(clickedDiv);
   
}

function clickedReclick(event) {
    const target = event.target.id;
    delete clicked[target];
    renderClicked();
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

function dragEvent(event) {
    target = document.getElementById('inbetween')

    function moveAt(pageY) {
        const outerDiv = target.parentNode;
        const rect = outerDiv.getBoundingClientRect();
        /* rect.top rect.bottom x.height*/
        const topBox = document.getElementById('weapon1')
        const botBox = document.getElementById('weapon2')
        if (rect.top + (rect.height * 0.02) > pageY - 15) {
            target.style.top = rect.top + rect.height * 0.02
            topBox.style.height = rect.top + rect.height * 0.02 + 8 + 'px'
            botBox.style.height = rect.height + rect.top + rect.height * 0.02 + 8 + 'px'
        } else if (rect.bottom - (rect.height * 0.05) < pageY - 15) {
            target.style.top = rect.bottom - (rect.height * 0.05)
            topBox.style.height = rect.bottom - (rect.height * 0.05) + 8 + 'px'
            botBox.style.height = rect.height - (rect.bottom - (rect.height * 0.05) + 8) + 'px'
        } else {
            target.style.top = pageY - 15 + 'px';
            topBox.style.height = pageY - 15 + 8 + 'px';
            botBox.style.height = rect.height - (pageY - 15 + 8) + 'px';
        }
        
    }

    function mouseMovement(event) {
        moveAt(event.pageY)
    }

    document.addEventListener('mousemove', mouseMovement, true);
    function mouseUp(event) {
        document.removeEventListener('mousemove', mouseMovement, true);
        document.removeEventListener('mouseup', mouseUp)
    }
    document.addEventListener('mouseup', mouseUp)
}

function resetEvent(event) {
    target = document.getElementById('inbetween')
    const outerDiv = target.parentNode;
    const rect = outerDiv.getBoundingClientRect();

    const topBox = document.getElementById('weapon1');
    const botBox = document.getElementById('weapon2');

    target.style.top = rect.top + rect.height * 0.5 - 7.5 + 'px';
    topBox.style.height = rect.top + rect.height * 0.5 + 7.5 + 'px'
    botBox.style.height = rect.top + rect.height * 0.5 - 7.5 + 'px'
}

function copy(event) {
    navigator.clipboard.writeText(JSON.stringify(destinyData)).then(function () {
        console.log('done')
    }, function (err) {
        console.error('error')
    });
}

function weaponRender(weapon, targetEle) {
    const stats = weapon['stats']['stats'];
    for (let idx in stats) {
        stats[idx]['displayInfo'] = destinyData['DestinyStatDefinition'][idx]['displayProperties']
    };
    console.log(weapon)
    const displayProperties = weapon['displayProperties'];
    const quality = weapon['quality'];
    const investmentStats = weapon['investmentStats'];
    const sockets = weapon['sockets'];
    const perks = [];
    for (let idx in sockets['socketEntries']) {
        var plug = []
        if (sockets['socketEntries'][idx]['randomizedPlugSetHash'] != undefined) {
            plug = destinyData["DestinyPlugSetDefinition"][sockets['socketEntries'][idx]['randomizedPlugSetHash']];
        } else if (sockets['socketEntries'][idx]['singleInitialItemHash'] != undefined) {
            plug = destinyData["DestinyPlugSetDefinition"][sockets['socketEntries'][idx]['singleInitialItemHash']];
        }
        if (!(plug === undefined)) {
            let perkList = [];
            for (let entry in plug['reusablePlugItems']) {
                perkList.push(destinyData['DestinyInventoryItemDefinition'][plug['reusablePlugItems'][entry]['plugItemHash']])
            }
            perks.push(perkList);
        }

    }

    const image = "https://www.bungie.net" + weapon['screenshot'];


    const weaponContainer = document.createElement('div');
    weaponContainer.setAttribute('class', 'weaponContainer');
    weaponContainer.setAttribute('id', 'weaponContainer');
    targetEle.appendChild(weaponContainer)

    const weaponImg = document.createElement('img');
    weaponImg.setAttribute('class', 'weaponImg')
    weaponImg.setAttribute('id', 'weaponImg')
    weaponImg.src = image;
    weaponContainer.appendChild(weaponImg);

    const perkContainer = document.createElement('div')
    perkContainer.setAttribute('class', 'perkContainer')
    for (let i in perks) {
        const firstPerks = document.createElement('div');
        firstPerks.setAttribute('class', 'perkRow' + i + ' perkRow')
        for (let pk in perks[i]) {
            const perk = perks[i][pk]
            const currPerk = document.createElement('img')
            currPerk.onclick = perkClick;
            currPerk.setAttribute('id', i + " " + pk.toString())
            currPerk.setAttribute('class', 'weaponPerk')
            currPerk.src = "https://www.bungie.net" + perk['displayProperties']['icon']
            const hoverDiv = document.createElement('div')
            hoverDiv.setAttribute('class', 'perkContent')
            hoverDiv.innerHTML = perk['displayProperties']['name']
            currPerk.appendChild(hoverDiv);
            firstPerks.appendChild(currPerk);
        }
        perkContainer.appendChild(firstPerks)
    }
    weaponContainer.appendChild(perkContainer)

}

function perkClick(event) {
    target = document.getElementById(event.target.id)
    const removeClicked = target.parentNode.getElementsByClassName('clickedPerk')
    if (target.className === 'weaponPerk') {
        for (let i in Object.keys(removeClicked)) {
            if (removeClicked.length > 0 && removeClicked[i].id.substring(0, 1) === target.id.substring(0, 1)) {
                removeClicked[i].setAttribute('class', 'weaponPerk')
            }
        }
        target.setAttribute('class', 'clickedPerk')
    } else {
        for (let i in removeClicked) {
            if (removeClicked.length > 0 && removeClicked[i].id.substring(0, 1) === target.id.substring(0, 1)) {
                removeClicked[i].setAttribute('class', 'weaponPerk')
            }
        }
    }
    
}