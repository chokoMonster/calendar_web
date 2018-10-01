<?php 
	session_start();
	error_reporting(0);
	if(isset($_GET['id']) && isset($_SESSION['user']))
	{
		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}
		
		$statement = $mysqli->prepare("delete from teilnehmer where benutzer=?");
		$statement->bind_param("s", $_GET['id']);
		$statement->execute();
		mysqli_close($mysqli);
		
		echo 'ok';
		
	} else {
		echo "Fehler bei der Daten&uuml;bermittlung!";
	}
?>