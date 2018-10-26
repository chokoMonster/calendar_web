let sonderzeichen = ['trainer', 'gegner', 'bemerkung'];
			
function fillComboBox() {
	let anweisung_alter = "";
	for (let i in age_array) {
		anweisung_alter += "<option value='" + i + "' id='" + i + "'>" + age_array[i] + "</option>";
	}
	anweisung_alter += "<option value='leer_age' id='leer_age' selected></option>";
	document.getElementById("cmb_age").innerHTML = anweisung_alter;

	let anweisung_kategorie = "";
	for (let i in category_array) {
		anweisung_kategorie += "<option value='" + i + "' id='" + i + "'>" + category_array[i] + "</option>";
	}
	anweisung_kategorie += "<option value='leer_category' id='leer_category' selected></option>";
	document.getElementById("cmb_category").innerHTML = anweisung_kategorie;

	let anweisung_liga = "";
	for (let i in league_array) {
		anweisung_liga += "<option value='" + i + "' id='" + i + "'>" + league_array[i] + "</option>";
	}
	anweisung_liga += "<option value='leer_league' id='leer_league' selected></option>";
	document.getElementById("cmb_league").innerHTML = anweisung_liga;
}

function setButtons() {
	if(sessionStorage.rechte==0) {
		let anweisung_btn = "<input type='button' class='btn btn-default' value='Neu' onclick='formNeu()'>";
		anweisung_btn += "<input type='Submit' class='btnMitte1 btn btn-warning' name='speichern' value='Speichern' id='speichern'>";
		anweisung_btn += "<input type='button' class='btnMitte2 btn btn-warning' name='loeschen' value='L&ouml;schen' id='loeschen' onclick='loesche()'>";
		anweisung_btn += "<input type='button' class='btn btn-default' value='Abbrechen' onclick='formReset()'>";

		/*let anweisung_btn = "<input type='button' class='btn-default' value='Neu' onclick='formNeu()'>";
		anweisung_btn += "<input type='Submit' class='btnMitte1 btn-default' name='speichern' value='Speichern' id='speichern'>";
		anweisung_btn += "<input type='button' class='btnMitte2 btn-warning' name='loeschen' value='L&ouml;schen' id='loeschen' onclick='loesche()'>";
		anweisung_btn += "<input type='button' class='btn-warning' value='Abbrechen' onclick='formReset()'>";*/

		document.getElementById("btn_form").innerHTML = anweisung_btn;
	} else {
		ids_form.pop();
		ids_form.pop();
	}
}

function standardWerte() {
	let d = new Date();
	let tag = d.getDate();
	let monat = d.getMonth()+1;
	if(tag<10) {
		tag = '0' + tag;
	}
	if(monat<10) {
		monat = '0' + monat;
	}
	document.getElementById('datum').value = (tag + '.' + monat + '.' + d.getFullYear());
	
	let daten = ['beginn_h', 'beginn_min', 'ende_h', 'ende_min'];
	for(let d in daten) {
		if(document.getElementById(daten[d]).value == "") {
			document.getElementById(daten[d]).value = '00';
		}
	}	
	document.getElementById('datum_save').value="";			
	document.getElementById('nr').value="";
	document.getElementById('gegner').value="";
	document.getElementById('bemerkung').value="";
	document.getElementById('passiv').checked = false;
	document.getElementById('int4').checked=true;
	document.getElementById('training').checked=true;
}

function formNeu() {
	formVorbereiten();
	standardWerte();
	document.getElementById('loeschen').setAttribute('disabled', true);
}

function setDisabled() {
	for (let i in ids_form) {
		if(sessionStorage.rechte==0) {
			document.getElementById(ids_form[i]).setAttribute('disabled', true);
		} else {
			document.getElementById(ids_form[i]).setAttribute('readonly', true);
			//$(':radio:not(:checked)').attr('disabled', true);
		}						
	}
}

function formReset() {
	document.getElementById('form_eintrag').reset();
	removeFarbe();
	setDisabled();
	
	document.getElementById('datum_save').value="";
	for(let i=0; i<10; i++) {
		document.getElementById('int'+i).removeAttribute('checked');
	}
	document.getElementById('training').removeAttribute('checked');
	document.getElementById('spiel').removeAttribute('checked');
	document.getElementById('gegner_feld').setAttribute('hidden', true);

	let elem_alter = document.getElementById('leer_age');
	elem_alter.setAttribute('selected', true);
	elem_alter.removeAttribute('hidden');
	let elem_kategorie = document.getElementById('leer_category');
	elem_kategorie.setAttribute('selected', true);
	elem_kategorie.removeAttribute('hidden');
	let elem_liga = document.getElementById('leer_league');
	elem_liga.setAttribute('selected', true);
	elem_liga.removeAttribute('hidden');
}

function pruefeKategorie() {
	if(document.getElementById('cmb_category').options[document.getElementById('cmb_category').selectedIndex].value == "mannschaft" ||
	   document.getElementById('cmb_category').options[document.getElementById('cmb_category').selectedIndex].value == "other_category") {
		document.getElementById('liga_feld').removeAttribute('hidden');
	} else {
		document.getElementById('liga_feld').setAttribute('hidden', true);
	}
}

function trainingSelected() {
	document.getElementById('gegner_feld').setAttribute('hidden', true);
	document.getElementById('cmb_category').removeAttribute('disabled');
}

function spielSelected() {
	document.getElementById('gegner_feld').removeAttribute('hidden');
	document.getElementById('cmb_category').selectedIndex = 0;
	document.getElementById('cmb_category').setAttribute('disabled', true);
}

function setCookie(name) {
	let dt = new Date();
	dt.setTime(dt.getTime() + (1000*24*60*60*1000));
	//document.cookie = name + "=" + value;
	let wert=1;
	if(getCookie(name) != null) {
		wert = parseInt(getCookie(name)) + 1;
	} else {
		if(getCookie("trainer_alle") == null) {
			document.cookie = 'trainer_alle=' + name + '; expires=' + dt.toGMTString();
		} else {
			if(getCookie('trainer_alle').indexOf(name) === -1) {
				document.cookie = 'trainer_alle=' + getCookie('trainer_alle') + '&' + name;
			}
		}
	}
	document.cookie = name + '=' + wert + '; expires=' + dt.toGMTString();
}

function getCookie(name) {
	let data = document.cookie.split(";");
	let cookies = {};
	for(let i=0; i<data.length; i++) {
		let tmp = data[i].split("=");
		cookies[tmp[0].trim()] = tmp[1];
	}
	//if (name) {
		return (cookies[name] || null);
	/*} else {
		return cookies;
	}*/
}

function loesche() {
	let anfrage_del;
	if (window.XMLHttpRequest) {
		anfrage_del=new XMLHttpRequest();
	} else {
		anfrage_del=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	anfrage_del.open("GET","../php/delEintrag.php?datum="+document.getElementById('datum').value+"&nr="+document.getElementById('nr').value,true);
	anfrage_del.send();
	anfrage_del.onreadystatechange=function()
	{
		let resp = anfrage_del.responseText;
		parent.kalender.location.reload(true);
		
		formReset();
		if(resp=='ok') {
			//document.getElementById("ausgabe").style.color = "#088A08";
			document.getElementById("ausgabe").innerHTML = "<div class='alert alert-success'>Eintrag wurde gel&ouml;scht!</div>";
		} else {
			//document.getElementById("ausgabe").style.color = "#DF0101";
			document.getElementById("ausgabe").innerHTML = "<div class='alert alert-danger'>resp</div>";
		}
	}		
}

function pruefen()
{
	document.getElementById("ausgabe").innerHTML = "";
	let check = false;
	for (let p in pflichtfelder) {
		if(document.getElementById(pflichtfelder[p]).value=='') {
			check = true;
			document.getElementById(pflichtfelder[p]).style.backgroundColor  = "#FFCCCC";
		} else {
			document.getElementById(pflichtfelder[p]).style.removeProperty("background-color");
		}
	}
	if(document.getElementById("spiel").checked && document.getElementById("gegner").value=='') {
		check = true;
		document.getElementById("gegner").style.backgroundColor  = "#FFCCCC";
	} else {
		document.getElementById("gegner").style.removeProperty("background-color");
	}
	if(document.getElementById("passiv").checked && document.getElementById("bemerkung").value=='') {
		check = true;
		document.getElementById("bemerkung").style.backgroundColor  = "#FFCCCC";
	} else {
		document.getElementById("bemerkung").style.removeProperty("background-color");
	}
	if(check) {
		//document.getElementById("ausgabe").style.color = "#DF0101";
		document.getElementById("ausgabe").innerHTML = "<div class='alert alert-danger'>Bitte f&uuml;llen Sie alle Pflichtfelder!</div>";//"Bitte f&uuml;llen Sie alle Pflichtfelder!";
		return false;
	}
	
	let wertDate = document.getElementById('datum').value.split('.');
	if(wertDate.length!=3) {
		check = true;
	}
	for(let i in wertDate) {
		if(isNaN(wertDate[i])) {
			check = true;
		} else {
			parseInt(wertDate[i])
		}
	}
	if(wertDate[2]<2000 || wertDate[2]>2099 || wertDate[1]<1 || wertDate[1]>12 
	|| wertDate[0]<1 || !isValidDate(wertDate[2], wertDate[1]-1, wertDate[0])) {
		check = true;
	}
	if(check) {
		//document.getElementById("ausgabe").style.color = "#DF0101";
		document.getElementById("ausgabe").innerHTML = "<div class='alert alert-danger'>Datum ung&uuml;ltig! Format: dd.mm.yyyy</div>";
		return false;
	}
			
	let stunde = ['beginn_h', 'ende_h'];
	for (let s in stunde) {
		let element = document.getElementById(stunde[s]);
		if(isNaN(element.value) || element.value<0 || element.value>24 || element.value.indexOf('.')!==-1) {
			check = true;
			element.style.backgroundColor  = "#FFCCCC";
		} else {
			element.style.removeProperty("background-color");
		}
	}
	let minute = ['beginn_min', 'ende_min'];
	for (let m in minute) {
		let element = document.getElementById(minute[m]);
		if(isNaN(element.value) || element.value<0 || element.value>=60 || element.value.indexOf('.')!==-1) {
			check = true;
			element.style.backgroundColor  = "#FFCCCC";
		} else {
			element.style.removeProperty("background-color");
		}
	}
	if(parseInt(document.getElementById('beginn_h').value)>parseInt(document.getElementById('ende_h').value)
	|| (parseInt(document.getElementById('beginn_h').value)==parseInt(document.getElementById('ende_h').value)
	&& parseInt(document.getElementById('beginn_min').value)>=parseInt(document.getElementById('ende_min').value))) {
		check = true;
	}
	if(check) {
		//document.getElementById("ausgabe").style.color = "#DF0101";
		document.getElementById("ausgabe").innerHTML = "<div class='alert alert-danger'>Uhrzeit ung&uuml;ltig!</div>";
		return false;
	}
	
	for (let s in sonderzeichen) {
		if(document.getElementById(sonderzeichen[s]).value.indexOf('&')!==-1 || document.getElementById(sonderzeichen[s]).value.indexOf(';')!==-1) {
			check = true;
			document.getElementById(sonderzeichen[s]).value = document.getElementById(sonderzeichen[s]).value.replace(";", ",");
			document.getElementById(sonderzeichen[s]).value = document.getElementById(sonderzeichen[s]).value.replace("&", "und");
			document.getElementById(sonderzeichen[s]).style.backgroundColor  = "#A9D0F5";
		} else {
			document.getElementById(sonderzeichen[s]).style.removeProperty("background-color");
		}
	}
	if(check) {
		//document.getElementById("ausgabe").style.color = "#DF0101";
		document.getElementById("ausgabe").innerHTML = "<div class='alert alert-danger'>Bitte vermeiden Sie '&' und ';'</div>";
		return false;
	}
	
	return true;
}

function absenden() {
	/*if(document.getElementById('trainer').value == "") {
		setCookie(document.getElementById('trainer').value.trim());
	}*/

	if(document.getElementById('datum_save').value!=document.getElementById('datum').value && document.getElementById('nr').value!="") {
		let anfrage_del_old;
		if (window.XMLHttpRequest) {
			anfrage_del_old=new XMLHttpRequest();
		} else {
			anfrage_del_old=new ActiveXObject("Microsoft.XMLHTTP");
		}
		anfrage_del_old.open("GET","../php/delEintrag.php?datum="+document.getElementById('datum_save').value+"&nr="+document.getElementById('nr').value,true);
		anfrage_del_old.send();
		document.getElementById('nr').value="";
	}
	
	let anfrage_save;
	if (window.XMLHttpRequest) {
		anfrage_save=new XMLHttpRequest();
	} else {
		anfrage_save=new ActiveXObject("Microsoft.XMLHTTP");
	}
	let daten = new FormData(document.getElementById("form_eintrag"));

	anfrage_save.onreadystatechange=function() {
		let resp = anfrage_save.responseText;
		formReset();
		
		if(resp=='ok') {
			//document.getElementById("ausgabe").style.color = "#088A08";
			document.getElementById("ausgabe").innerHTML = "<div class='alert alert-success'>Eintrag wurde gespeichert!</div>";
		} else {
			//document.getElementById("ausgabe").style.color = "#DF0101";
			document.getElementById("ausgabe").innerHTML = "<div class='alert alert-danger'>resp</div>";
		}
		parent.kalender.location.reload(true);
	}
	anfrage_save.open("POST", "../php/setEintrag.php");
	anfrage_save.send(daten);
}

window.addEventListener("load", function () 
{
	document.getElementById("form_eintrag").addEventListener("submit", function (event) {
		event.preventDefault();
		let check = pruefen();
		document.getElementById("cmb_category").removeAttribute('disabled');
		if(check){absenden();}
	});
});