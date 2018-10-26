<?php
	session_start();
	if(isset($_SESSION['user'])) {
		
		$id=$_GET['id'];
		if($_GET['id']=="SESSIONUSER") {
			$id = $_SESSION['user'];
		}

		$m=$_GET['monat'];
		$y=$_GET['jahr'];
		$m2=$m+1;
		$y2=$y;
		if($m2==13) {
			$m2=1;
			$y2=$y+1;
		}
		
		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}

		//$statement = $mysqli->prepare("select * from eintraege where benutzer=? and datum >= '$y-$m-01' and datum < '$y2-$m2-01'");
		$statement = $mysqli->prepare("select DATUM, NR, BEGINN, KATEGORIE, LIGA from eintraege where benutzer=? and datum >= '$y-$m-01' and datum < '$y2-$m2-01'");
		$statement->bind_param("s", $id);
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