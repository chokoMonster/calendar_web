<?php 
	session_start();
	error_reporting(0);
	if(isset($_GET['spieler']) && isset($_SESSION['user']))
	{
		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}
		
		$statement = $mysqli->prepare("delete from gruppierung where admin=? and teilnehmer=?");
		$statement->bind_param("ss", $_SESSION['user']), $_GET['id']);
		$statement->execute();
		mysqli_close($mysqli);
		
		echo 'ok';
		
	} else {
		echo "Fehler bei der Daten&uuml;bermittlung!";
	}
?>