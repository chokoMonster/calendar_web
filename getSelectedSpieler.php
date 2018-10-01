<?php	
	session_start();
	if(isset($_SESSION['user'])) {
		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}

		$id = $_GET['id'];
		if($_GET['id']=="profilAendern") {
			$id = $_SESSION['user'];
		}

		$statement = $mysqli->prepare("select BENUTZER, NNAME, VNAME, VEREIN, GEBURTSTAG, RECHTE from teilnehmer where benutzer=?");
		$statement->bind_param("s", $id);
		$statement->execute();
		$result = $statement->get_result();
		 
		while($row = $result->fetch_assoc()) {
		  echo $row['BENUTZER'], "&", $row['NNAME'], "&", $row['VNAME'] , "&", $row['VEREIN'] , "&", $row['GEBURTSTAG'], "&", $row['RECHTE'];
		}
	}
?>