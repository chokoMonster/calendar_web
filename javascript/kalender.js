let anfrage, anfrage2;
//var benutzer = sessionStorage.benutzer;
init();

/*
let liga = { 
	//"dbbl":"Bundesliga",
	//"dbbl2":"2.Bundesliga",
	"rl":"Regionalliga",
	"wnbl":"WNBL",
	"byl":"Bayernliga",
	"bzl":"Bezirksliga",
	//"natio":"Nationalmannschaft",
	"sonstige3":"Sonstiges",
}*/

/*
let kategorie = {
	"mannschaft":"Mannschaft",
	"individual":"Individual",
	"stuetzpunkt":"St&uuml;tzpunkt",
	"athletik":"Athletik",
	"wurf":"Wurf",
	"ausdauer":"Ausdauer",
	"reha":"Rehabilitation",
	"sonstige2":"Sonstiges",
}*/

let category_array, league_array, age_array;

let ids_form = new Array('datum', 'passiv', 'beginn_h', 'beginn_min', 'ende_h', 'ende_min', 'cmb_age', 'cmb_category', 'cmb_league', 'trainer', 'int0', 'int1', 'int2', 'int3', 'int4', 'int5', 'int6', 'int7', 'int8', 'int9', 'training', 'spiel', 'gegner', 'bemerkung', 'speichern', 'loeschen');
let pflichtfelder = ['datum', 'beginn_h', 'beginn_min', 'ende_h', 'ende_min', 'trainer'];

function init()
{
	if (window.XMLHttpRequest){
		// AJAX nutzen mit IE7+, Chrome, Firefox, Safari, Opera
		anfrage=new XMLHttpRequest();
		anfrage2=new XMLHttpRequest();
	} else {
		// AJAX mit IE6, IE5
		anfrage=new ActiveXObject("Microsoft.XMLHTTP");
		anfrage2=new ActiveXObject("Microsoft.XMLHTTP");
	}

	anfrage.open("GET","../php/getValues.php?id=CATEGORY,LEAGUE", true);
	anfrage.send();
	
	anfrage.onreadystatechange=function()
	{
		let json_values = new Array();
		if(anfrage.readyState==4 && anfrage.status==200) {
			json_values = JSON.parse(anfrage.responseText);
		}

		for (j in json_values) {
			if(json_values[j].KEY=='CATEGORY') {
				category_array[json_values[j].VALUE] = json_values[j].VALUE2;
			} else if(json_values[j].KEY=='LEAGUE') {
				league_array[json_values[j].VALUE] = json_values[j].VALUE2;
			} else if(json_values[j].KEY=='AGE') {
				age_array[json_values[j].VALUE] = json_values[j].VALUE2;
			}
		}
	}
}
	
function start()
{
	//aktuelles Datum ermitteln und speichern
	let d = new Date();
	setAktDatum(d);
	
	ladeKalender();
}

function erstelleKalender()
{
	let wochentage=new Array('Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag');
	let table = document.getElementById('tbl_kalender');
	let anweisung="<tr style='visibility:collapse;' hidden><td colspan=7 id='datum_akt'>-<\/td><\/tr><tr>";
	anweisung = anweisung + "<td class='tbl_title'><a class='tbl_move' onclick='prevMonth()'> &laquo;<\/a><\/td>";
	anweisung = anweisung + "<td colspan=5 class='tbl_title' id='monatName'>---<\/td>";
	anweisung = anweisung + "<td class='tbl_title'><a class='tbl_move' onclick='nextMonth()'> &raquo;<\/a><\/td><\/tr><tr>";				
	for (let i=0; i<=6; i++)
	{
		anweisung = anweisung + "<td class='tbl_head tbl_zelle'>" + wochentage[i] + "<\/td>";
	}			
	anweisung = anweisung + "<\/tr><tr>";				
	for (let i=1; i<=42; i++)
	{
		anweisung = anweisung + "<td class='tbl_tage tbl_zelle' id='zelle" + i + "'><\/td>";				
		if(i%7==0 && i!=42)
		{
			anweisung = anweisung + "<\/tr><tr>";
		}
	}
	anweisung = anweisung + "<\/tr>";				
	table.innerHTML=anweisung;
}
			
function ladeKalender() 
{
	//aktuelles Datum holen und splitten
	let aktDatum = getAktDatum();
	let m = aktDatum.getMonth();
	let y = aktDatum.getFullYear();

	//anfrage.open("GET","../php/getEintraege.php?id="+benutzer+"&monat="+(m+1)+"&jahr="+y,true);
	let selectedSpieler;
	try {
		selectedSpieler = parent.document.getElementById('spieler').options[parent.document.getElementById('spieler').selectedIndex].value;
	} catch(err) {
		selectedSpieler = "SESSIONUSER";
	}
	//let selectedSpieler = parent.kalender.document.getElementById('spieler').options[parent.kalender.document.getElementById('spieler').selectedIndex].value;
	anfrage.open("GET","../php/getEintraege.php?id="+selectedSpieler+"&monat="+(m+1)+"&jahr="+y, true);
	anfrage.send();
	
	anfrage.onreadystatechange=function()
	{	
		if(getAktDatum().getMonth() != m) {
			return;
		}

		//document.all.monatName.innerHTML = getMonatName(m+1) + ' ' + y;
		parent.kalender.document.getElementById('monatName').innerHTML = getMonatName(m+1) + ' ' + y;
		
		//Wochentag vom ersten des Monats ermitteln
		let wochentag1 = new Date(y, m, 1).getDay(); //So = 0, Mo = 1 ... Sa = 6
		wochentag1 = (wochentag1 == 0) ? 7: wochentag1;
		wochentag1--;
		
		//Speicher für Zelle und Tag des Durchlaufs
		let zelle_akt, tagZelle;

		//Variable wird auf true gesetzt, wenn Spalte nach dem Monatsende ausgefüllt ist
		let hide_zelle = false;
		 
		let eintraege = Array();
		//alle Zellen durchlaufen
		for (let i = 1; i <= 42; i++)
		{
			//aktuelle Zelle
			zelle_akt = parent.kalender.document.getElementById('zelle'+i);
			//errechnen des Tages --> datum
			tagZelle = i-wochentag1;
			let datumZelle = new Date(y,m,tagZelle);
	 
			//Eintragen der Daten ab ersten Tag im Monat bis zum Letzten
			if (i >= (wochentag1+1) && isValidDate(y,m,tagZelle)) 
			{				
				let anweisung = tagZelle + "<br>";
				let termine_relevant = new Array();	
				
				let json_termine = new Array();
				if(anfrage.readyState==4 && anfrage.status==200) {
					json_termine = JSON.parse(anfrage.responseText);
				}

				for (j in json_termine) {
					json_termine[j].DATUM = new Date(json_termine[j].DATUM);
					if(json_termine[j].DATUM.getDate()==tagZelle) {
						termine_relevant[termine_relevant.length] = json_termine[j];
					}
				}
				
				let datum_eintrag = "";
				if(tagZelle<10) {
					datum_eintrag = "0";
				}
				datum_eintrag += tagZelle + ".";
				if((m+1)<10) {
					datum_eintrag += "0";
				}
				datum_eintrag += (m+1) + "." + y;
				
				anz_termine = termine_relevant.length;
				for (let k=0; k<anz_termine; k++) {
					let minimum = termine_relevant[0].BEGINN;
					let pos_minimum = 0;
					for(let i=0 ; i<termine_relevant.length; i++) {
						if(termine_relevant[i].BEGINN < minimum) {
							minimum = termine_relevant[i].BEGINN;
							pos_minimum = i;
						}
					}
					let showText = category_array[termine_relevant[pos_minimum].KATEGORIE];
					if(termine_relevant[pos_minimum].KATEGORIE=="mannschaft" || termine_relevant[pos_minimum].KATEGORIE=="other_category") {
						showText = league_array[termine_relevant[pos_minimum].LIGA];
					}
					anweisung += "<p class='tbl_eintrag' id='eintrag_" + datum_eintrag + "_" + termine_relevant[pos_minimum].NR + "' onclick='zeigeEintrag(this.id)'>" + (termine_relevant[pos_minimum].BEGINN).substring(0,5) + " " + showText +"</p>";
					termine_relevant.splice(pos_minimum,1);
				}
				
				zelle_akt.innerHTML=anweisung;				
						
				//zelle_akt.innerHTML = "<td class='tbl_tage tbl_zelle' onclick=javascript:putDate("+tagZelle+")>"+tagZelle+"</a>";
				zelle_akt.hidden = false;
				zelle_akt.style.visibility='visible';
				//zelle_akt.style.border = 'solid 1px';
				
				let heute = new Date();
				//heutiges Datum und Feiertage hervorheben					 
				if (heute.getDate() == datumZelle.getDate() && 
					heute.getMonth() == datumZelle.getMonth() && 
					heute.getYear() == datumZelle.getYear())
				{
					zelle_akt.style.fontWeight = 'bold';
					zelle_akt.style.backgroundColor = '#F5D0A9'; //'#F6E3CE'; //'#CEECF5';
				}
				else if (isFeiertag(m,tagZelle)) {
					//zelle_akt.style.color='#FF0000';
					zelle_akt.style.backgroundColor = '#F6CED8'; //'#F8E0E6';
				}
				else {
					//zelle_akt.style.color='#000000';
					zelle_akt.style.fontWeight = 'normal';
					zelle_akt.style.backgroundColor = '#FFFFFF';
				}
			} else {
				zelle_akt.innerHTML = '';
				zelle_akt.style.backgroundColor = '#FFFFFF';
				//zelle_akt.style.visibility='hidden';
				//zelle_akt.style.border = '0px';
				/*console.log(i);
				console.log(hide_zelle);
				console.log(i%7);
				console.log(isValidDate(y,m,tagZelle));
				console.log(zelle_akt);*/
				if ((i>= wochentag1+1 && i%7==1) || hide_zelle) { //Kalenderende
					hide_zelle = true;
					zelle_akt.hidden = true;
				} else {
					zelle_akt.hidden = false;
				}
			}                               
		}     
	}	
	//anfrage.abort();
}


function nextMonth()
{
	let d = getAktDatum();
	let m = d.getMonth();
	let y = d.getFullYear(); 
	//Jahreswechsel?
	if (m==11) {
		m = -1;
		y = y + 1;
	}
	setAktDatum(new Date(y,m+1,01));
	ladeKalender();
}
function prevMonth()
{
	let d = getAktDatum();
	let m = d.getMonth();
	let y = d.getFullYear();
	//Jahreswechsel?
	if (m==0) {
		m = 11;
		y = y - 1;
	} else {
		m = m - 1;
	}
	setAktDatum(new Date(y,m,01));
	ladeKalender();
}

function isValidDate(y,m,d)
{
	let anzahl = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	if(y%4==0 || (y%100!=0 && y%400==0)) {
		anzahl[1] = 29;
	}
	
	if(d<=anzahl[m]) {
		return true;
	}
	return false;
}
		
/**
* setzt das übergebene Datum in die Speicherzelle
* @param d: datum zum schreiben in die Speicherzelle
*/
function setAktDatum(d)
{
	//document.all.datum_akt.innerHTML = d.getFullYear()+','+(d.getMonth()+1)+','+d.getDate();
	document.getElementById('datum_akt').innerHTML = d.getFullYear()+','+(d.getMonth()+1)+','+d.getDate();
}
/**
* Gibt das Datum aus der Speicherzelle zurück
* @return: datum in Date format
*/
function getAktDatum()
{
	//let s = document.all.datum_akt.innerHTML;
	let s = parent.kalender.document.getElementById('datum_akt').innerHTML;
	let z = s.split(',');
	return new Date(z[0],z[1]-1,z[2]);
}

function getMonatName(monat)
{
	let monatN = new Array('Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember');
	return monatN[monat-1];
}


function isFeiertag(m,d)
{   
	let feiertage = new Array("1.1","6.1","1.5","3.10","1.11","25.12","26.12");
	for (let i=0; i<feiertage.length; i++) {       
		if (feiertage[i].split(".")[0] == d && feiertage[i].split(".")[1] == (m+1))	{
			return true;
		}
	}
	return false;
}

function formVorbereiten()
{
	removeFarbe();
	
	//if(parent.rechte == 0) {
	if(sessionStorage.rechte == 0) {
		for (i in ids_form) {
			parent.formular.document.getElementById(ids_form[i]).removeAttribute('disabled');
		}
	}
	parent.formular.document.getElementById('gegner_feld').setAttribute('hidden', true);
	
	let elem_alter = parent.formular.document.getElementById('leer_age');
	elem_alter.removeAttribute('selected');
	elem_alter.setAttribute('hidden', true);
	
	let elem_kategorie = parent.formular.document.getElementById('leer_category');
	elem_kategorie.removeAttribute('selected');
	elem_kategorie.setAttribute('hidden', true);
	
	parent.formular.document.getElementById('liga_feld').removeAttribute('hidden');
	let elem_liga = parent.formular.document.getElementById('leer_league');
	elem_liga.removeAttribute('selected');
	elem_liga.setAttribute('hidden', true);
}

function removeFarbe()
{
	for (let p in pflichtfelder) {
		parent.formular.document.getElementById(pflichtfelder[p]).style.removeProperty("background-color");
	}
	parent.formular.document.getElementById("gegner").style.removeProperty("background-color");
	parent.formular.document.getElementById("bemerkung").style.removeProperty("background-color");
	parent.formular.document.getElementById("ausgabe").innerHTML = "";
}

function zeigeEintrag(id)
{
	formVorbereiten();
		
	//id im Format eintrag_dd.mm.yyyy_nr
	let datum = id.split("_")[1];
	let date = datum.split(".")[2] + "-" + datum.split(".")[1] + "-" + datum.split(".")[0];
	let nr = id.split("_")[2];	
	
	let selectedSpieler;
	try {
		selectedSpieler = parent.document.getElementById('spieler').options[parent.document.getElementById('spieler').selectedIndex].value;
	} catch(err) {
		selectedSpieler = "SESSIONUSER";
	}
	//let selectedSpieler = parent.kalender.document.getElementById('spieler').options[parent.kalender.document.getElementById('spieler').selectedIndex].value;
	anfrage2.open("GET","../php/getEintrag.php?id="+selectedSpieler+"&datum="+date+"&nr="+nr,true);
	anfrage2.send();
	
	anfrage2.onreadystatechange=function()
	{	
		if(anfrage2.readyState==4 && anfrage2.status==200) {
			for(let i=0; i<10; i++) {
				parent.formular.document.getElementById('int'+i).checked=false;
			}
			parent.formular.document.getElementById('training').checked=false;
			parent.formular.document.getElementById('spiel').checked=false;
			

			let json_eintrag = JSON.parse(anfrage2.responseText);
			json_eintrag.DATUM = new Date(json_eintrag.DATUM);
			
			parent.formular.document.getElementById('datum_save').value = parseDate(json_eintrag.DATUM);

			parent.formular.document.getElementById('datum').value = parseDate(json_eintrag.DATUM);
			parent.formular.document.getElementById('nr').value = json_eintrag.NR;
			parent.formular.document.getElementById('beginn_h').value = (json_eintrag.BEGINN).substring(0,2);
			parent.formular.document.getElementById('beginn_min').value = (json_eintrag.BEGINN).substring(3,5);
			parent.formular.document.getElementById('ende_h').value = (json_eintrag.ENDE).substring(0,2);
			parent.formular.document.getElementById('ende_min').value = (json_eintrag.ENDE).substring(3,5);
			parent.formular.document.getElementById(json_eintrag.ALTERSKLASSE).selected=true;
			parent.formular.document.getElementById(json_eintrag.KATEGORIE).selected=true;
			parent.formular.document.getElementById(json_eintrag.LIGA).selected=true;
			parent.formular.document.getElementById('trainer').value = json_eintrag.TRAINER;
			parent.formular.document.getElementById('int'+json_eintrag.INTENSITAET).checked =true;	
			parent.formular.document.getElementById(json_eintrag.ART).checked=true;
			parent.formular.document.getElementById('gegner').value = json_eintrag.GEGNER;
			parent.formular.document.getElementById('bemerkung').value = json_eintrag.BEMERKUNG;
			
			if(json_eintrag.PASSIV=="1") {
				parent.formular.document.getElementById('passiv').checked = true;
			} else {
				parent.formular.document.getElementById('passiv').checked = false;
			}
			if(json_eintrag.KATEGORIE=="mannschaft" || json_eintrag.KATEGORIE=="other_category") {
				parent.formular.document.getElementById('liga_feld').removeAttribute('hidden');
			} else {
				parent.formular.document.getElementById('liga_feld').setAttribute('hidden', true);
			}
			if(json_eintrag.ART=="spiel") {
				parent.formular.document.getElementById('gegner_feld').removeAttribute('hidden');
				parent.formular.document.getElementById('cmb_category').selectedIndex = 0;
				parent.formular.document.getElementById('cmb_category').setAttribute('disabled', true);
			}
		}	
	}
}

function parseDate(date) {
	let day = date.getDate();
	if(day<10) {
		day = "0" + day;
	}
	let month = date.getMonth()+1;
	if(month<10) {
		month = "0" + month;
	}
	return day + "." + month + "." + date.getFullYear();
}