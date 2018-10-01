<?php
	session_start();
	if(isset($_SESSION['user'])) {

		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}

		$statement = $mysqli->prepare("select VNAME, NNAME from teilnehmer where benutzer=? order by nname");
		$statement->bind_param("s", $_SESSION['user']);
		$statement->execute();	 
		$result = $statement->get_result();
		 
		while($row = $result->fetch_assoc()) {
		  echo $row['VNAME'], " ", $row['NNAME'];
		}
		
		mysqli_close($mysqli);
	}
?>