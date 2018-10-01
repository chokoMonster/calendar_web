<?php
	session_start();
	if(isset($_SESSION['user'])) {

		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}

		//$statement = $mysqli->prepare("select * from teilnehmer where rechte=0");
		$statement = $mysqli->prepare("select BENUTZER, VNAME, NNAME from teilnehmer where benutzer in (select teilnehmer from gruppierung where admin=?) order by nname");
		$statement->bind_param("s", $_SESSION['user']);
		$statement->execute();	 
		$result = $statement->get_result();
		 
		while($row = $result->fetch_assoc()) {
		  echo $row['BENUTZER'], "&", $row['VNAME'], " ", $row['NNAME'], ";";
		}
		
		mysqli_close($mysqli);
	}
?>