<?php
	session_start();
	error_reporting(0);
	if(isset($_POST['teilnehmer']) && isset($_SESSION['user']))
	{		
		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}
		
		$statement = $mysqli->prepare("select teilnehmer from gruppierung where admin=? and teilnehmer=?");
		$statement->bind_param("ss", $_POST['admin'], $_POST['teilnehmer']);
		$statement->execute();
		$result = $statement->get_result();

		if ($result->num_rows > 0) {
			echo 'ok';
			return;
		}

		$statement = $mysqli->prepare("insert into gruppierung (ADMIN, TEILNEHMER) values (?, ?)");
		$statement->bind_param("ss", $_POST['admin'], $_POST['teilnehmer']);
		$statement->execute();		

		mysqli_close($mysqli);
		
		echo 'ok';
		
	} else {
		echo "Fehler bei der Formular&uuml;bermittlung";
	}
?>