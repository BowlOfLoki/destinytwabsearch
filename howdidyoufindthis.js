const subclasses = ["Solar", "Void", "Arc", "Stasis", "Strand"]

function randomise(event) {
	const subclass = Math.floor(Math.random() * subclasses.length);
	const target = document.getElementById("randomise-text");
	target.innerHTML = subclasses[subclass];
}

function slider(event) {
	const target = document.getElementById("class-slider")
	const text = document.getElementById("drag-text")
	text.innerHTML = subclasses[target.value]
}

function removeClass(el, removed) {
	const classlist = el.classList
	let classStr = ""
	for (let i in Object.keys(classlist)) {
		if (classlist[i] !== removed) {
			classStr += " " + classlist[i];
		}
	}
	el.setAttribute("class", classStr);
}

function classMerge(el, add) {
	const classlist = el.classList
	let classStr = add
	for (let i in Object.keys(classlist)) {
		classStr += " " + classlist[i];
	}
	el.setAttribute("class", classStr);
}

function lightdarkclick(event) {
	const targid = event.target.id;
	if (event.target.classList.contains("selected-v")) {
		const wowers = "so cool";
	} else {
		const remid = 3 - targid;
		const rem0 = document.getElementById("" + remid)
		const rem1 = document.getElementById("1"+remid)
		const rem2 = document.getElementById("2"+remid)
		const rem3 = document.getElementById("3"+remid)

		removeClass(rem0, "selected-v");
		removeClass(rem1, "selected-v");
		removeClass(rem2, "selected-v");
		removeClass(rem3, "selected-v");
	}
	
	const row0 = document.getElementById(targid)
	const row1 = document.getElementById("1"+targid)
	const row2 = document.getElementById("2"+targid)
	const row3 = document.getElementById("3"+targid)
	
	classMerge(row0, "selected-v");
	classMerge(row1, "selected-v");
	classMerge(row2, "selected-v");
	classMerge(row3, "selected-v");
}

function endstartless(event) {
	const targid = event.target.id;
	const compare = {"10": ["2", "3"], "20": ["1", "3"], "30": ["1", "2"]}
	if (event.target.classList.contains("selected-h")) {
		const wowers = "so cool";
	} else {
		const remid = compare[targid];
		for (let i in remid) {
			const rem1 = document.getElementById(remid[i]+"0")
			console.log(remid[i]+"0")
			const rem2 = document.getElementById(remid[i]+"1")
			const rem3 = document.getElementById(remid[i]+"2")

			removeClass(rem1, "selected-h");
			removeClass(rem2, "selected-h");
			removeClass(rem3, "selected-h");
		}
	}
	const targ = targid.substring(0, 1);
	
	const row1 = document.getElementById(targ+"0")
	const row2 = document.getElementById(targ+"1")
	const row3 = document.getElementById(targ+"2")

	classMerge(row1, "selected-h");
	classMerge(row2, "selected-h");
	classMerge(row3, "selected-h");
}