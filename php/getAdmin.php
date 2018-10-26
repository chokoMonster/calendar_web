<?php
	session_start();
	if(isset($_SESSION['user'])) {

		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}

		$statement = $mysqli->prepare("select BENUTZER from teilnehmer where rechte=1");
		$statement->execute();	 
		$res = $statement->get_result();
		
		$result = array();
		while($row = $res->fetch_assoc()) {
			$result[] = $row;
		}
		echo json_encode($result);
		
		mysqli_close($mysqli);
	}
?>