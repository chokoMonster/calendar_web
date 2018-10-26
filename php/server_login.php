<?php
	if ((isset($_POST['user'])) && (isset($_POST['passwort']))) {
		session_start();
	 
		if (trim($_POST['user']) == '') {
			session_destroy();
			exit;
		}
	 
		$mysqli = new mysqli('localhost', 'root', 'dbb', 'dbb');
	 
		$statement = $mysqli->prepare("select BENUTZER, RECHTE from teilnehmer where benutzer=? and passwort=?");
		$statement->bind_param("ss", $_POST['user'], $_POST['passwort']);
		$statement->execute();
	 	$result = $statement->get_result();
	 
		if ($result->num_rows == 1) {
			$_SESSION['user'] = $_POST['user'];
			$row = $result->fetch_assoc();		
			echo json_encode($row);
		} else {
			session_destroy();
		}
		
		mysqli_close($mysqli);
	} else {
		session_destroy();
	}
?>