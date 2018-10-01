<?php
	session_start();
	error_reporting(0);
	if(isset($_POST['nname']) && isset($_SESSION['user']))
	{
		$date = explode(".", $_POST['gebdatum']);
		$gebdatum = $date[2]."-".$date[1]."-".$date[0];
		
		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}
		
		if(empty($_POST['modus'])) {
			$statement = $mysqli->prepare("select benutzer from teilnehmer where benutzer=?");
			$statement->bind_param("s", $_POST['user']);
			$statement->execute();
			$result = $statement->get_result();

			if ($result->num_rows > 0) {
				echo 'Dieser Benutzername ist bereits vergeben!';
				return;
			}
			
			/*if(!empty($_POST['gebdatum'])) {
				$sql = "insert into teilnehmer (BENUTZER, NNAME, VNAME, VEREIN, GEBURTSTAG, PASSWORT, RECHTE) values
				('$_POST[user]', '$_POST[nname]', '$_POST[vname]', '$_POST[verein]', '$gebdatum', '$_POST[passwort]', '$_POST[rechte]')";
			} else {
				$sql = "insert into teilnehmer (BENUTZER, NNAME, VNAME, VEREIN, PASSWORT, RECHTE) values
				('$_POST[user]', '$_POST[nname]', '$_POST[vname]', '$_POST[verein]', '$_POST[passwort]', '$_POST[rechte]')";
			}*/
			if(!empty($_POST['gebdatum'])) {
				$statement = $mysqli->prepare("insert into teilnehmer (BENUTZER, NNAME, VNAME, VEREIN, GEBURTSTAG, PASSWORT, RECHTE) values (?, ?, ?, ?, ?, ?, ?)");
				$statement->bind_param("sssssss", $_POST['user'], $_POST['nname'], $_POST['vname'], $_POST['verein'], $gebdatum, $_POST['passwort'], $_POST['rechte']);
			} else {
				$statement = $mysqli->prepare("insert into teilnehmer (BENUTZER, NNAME, VNAME, VEREIN, PASSWORT, RECHTE) values (?, ?, ?, ?, ?, ?)");
				$statement->bind_param("ssssss", $_POST['user'], $_POST['nname'], $_POST['vname'], $_POST['verein'], $_POST['passwort'], $_POST['rechte']);
			}
			$statement->execute();

			$statement = $mysqli->prepare("insert into gruppierung (ADMIN, TEILNEHMER) values (?, ?)");
			$statement->bind_param("ss", $_SESSION['user'], $_POST['user']);
			$statement->execute();		
			
		} else {
			/*if($_POST['passwort']=='') {
				$sql = "update teilnehmer set NNAME='$_POST[nname]', VNAME='$_POST[vname]', VEREIN='$_POST[verein]', GEBURTSTAG='$gebdatum', 
				RECHTE='$_POST[rechte]' where benutzer='$_POST[user]'";
			} else {
				$sql = "update teilnehmer set NNAME='$_POST[nname]', VNAME='$_POST[vname]', VEREIN='$_POST[verein]', GEBURTSTAG='$gebdatum', 
				PASSWORT='$_POST[passwort]', RECHTE='$_POST[rechte]' where benutzer='$_POST[user]'";
			}*/
			if($_POST['passwort']=='') {
				$statement = $mysqli->prepare("update teilnehmer set NNAME=?, VNAME=?, VEREIN=?, GEBURTSTAG=?, RECHTE=? where benutzer=?");
				$statement->bind_param("ssssss", $_POST['nname'], $_POST['vname'], $_POST['verein'], $gebdatum, $_POST['rechte'], $_POST['user']);
			} else {
				$statement = $mysqli->prepare("update teilnehmer set NNAME=?, VNAME=?, VEREIN=?, GEBURTSTAG=?, PASSWORT=?, RECHTE=? where benutzer=?");
				$statement->bind_param("sssssss", $_POST['nname'], $_POST['vname'], $_POST['verein'], $gebdatum, $_POST['passwort'], $_POST['rechte'], $_POST['user']);
			}

			$statement->execute();
		}
		
		//$statement = $mysqli->prepare($sql);
		//$statement->execute();
		mysqli_close($mysqli);
		
		echo 'ok';
		
	} else {
		echo "Fehler bei der Formular&uuml;bermittlung";
	}
?>