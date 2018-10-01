<?php
	session_start();
	if(isset($_SESSION['user'])) {
		//$datum=$_GET['datum'];
		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}
		
		$id=$_GET['id'];
		if($_GET['id']=="SESSIONUSER") {
			$id = $_SESSION['user'];
		}

		$statement = $mysqli->prepare("select DATUM, NR, BEGINN, ENDE, ALTERSKLASSE, KATEGORIE, LIGA, TRAINER, INTENSITAET, ART, GEGNER, BEMERKUNG, PASSIV from eintraege where benutzer=? and datum=? and nr=?");
		$statement->bind_param("sss", $id, $_GET['datum'], $_GET['nr']);	
		$statement->execute(); 
		$result = $statement->get_result();

		while($row = $result->fetch_assoc()) {
		  echo date("d.m.Y", strtotime($row['DATUM'])), "&", $row['NR'], "&", date("H:i", strtotime($row['BEGINN'])), "&", date("H:i", strtotime($row['ENDE'])),
		  "&", $row['ALTERSKLASSE'], "&", $row['KATEGORIE'], "&", $row['LIGA'], "&", $row['TRAINER'], "&", $row['INTENSITAET'], "&", $row['ART'], "&", $row['GEGNER'], "&", $row['BEMERKUNG'], "&", $row['PASSIV'];
		}
		
		mysqli_close($mysqli);
	}
?>