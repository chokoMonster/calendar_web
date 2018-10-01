<?php
	session_start();
	error_reporting(0);
	if(isset($_GET['datum']) && isset($_SESSION['user']))
	{
		$date = explode(".", $_GET['datum']);
		$datum = $date[2]."-".$date[1]."-".$date[0];
		
		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}
		
		$statement = $mysqli->prepare("delete from eintraege where benutzer=? and datum=? and nr=?");
		$statement->bind_param("sss", $_SESSION['user'], $datum, $_GET['nr']);		
		$statement->execute();
		mysqli_close($mysqli);
		
		echo 'ok';

	} else {
		echo "Fehler bei der Daten&uuml;bermittlung!";
	}
?>