<?php
	session_start();
	if(isset($_SESSION['user'])) {

		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}

		$statement = $mysqli->prepare("select BENUTZER from teilnehmer where rechte=1");
		$statement->execute();	 
		$result = $statement->get_result();
		 
		while($row = $result->fetch_assoc()) {
		  echo $row['BENUTZER'], ";";
		}
		
		mysqli_close($mysqli);
	}
?>