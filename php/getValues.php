<?php
	session_start();
	if(isset($_SESSION['user'])) {
		
		$id=$_GET['id'];
		
		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}

		$statement = $mysqli->prepare("select KEY, VALUE, VALUE2 from calendar_values where key in (?)");
		$statement->bind_param("s", $id);
		$statement->execute();
		$result = $statement->get_result();
		
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
			$rows[] = $r;
		}

		echo json_encode($rows);
		
		mysqli_close($mysqli);
	}
?>