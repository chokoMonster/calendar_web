<?php	
	$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
	if ($mysqli->connect_errno) {
		die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
	}

	//$sql = "select * from teilnehmer where benutzer='$_POST[user]' and passwort='$_POST[passwort]'";
	//$statement = $mysqli->prepare($sql);
	$statement = $mysqli->prepare("select BENUTZER, RECHTE from teilnehmer where benutzer=? and passwort=?");
	$statement->bind_param("ss", $_POST['user'], $_POST['passwort']);
	$statement->execute();	 
	$result = $statement->get_result();
	 
	while($row = $result->fetch_assoc()) {
		echo $row['BENUTZER'], "&", $row['RECHTE'], "&";
		echo 'richtig';
	}
?>