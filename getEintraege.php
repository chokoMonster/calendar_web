<?php
	session_start();
	if(isset($_SESSION['user'])) {
		/*
		//mysql_connect("localhost", "root", "dbb") or die (mysql_error());
		//mysql_connect("localhost", "tnutzer", "1234", "meintest") or die (mysql_error());
		//mysql_select_db("meintest") or die (mysql_error());
		//$abfrage = "select * from satelliten";
		while($zeile = mysql_fetch_array($result)) {
			//echo $zeile['SatName'].'<br>';
		}
		mysql_close();
		*/
		
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
		//$sql = "select * from eintraege where benutzer='$id' and datum >= '$y-$m-01' and datum < '$y2-$m2-01'";
		//$statement = $mysqli->prepare($sql);
		$statement = $mysqli->prepare("select DATUM, NR, BEGINN, KATEGORIE, LIGA from eintraege where benutzer=? and datum >= '$y-$m-01' and datum < '$y2-$m2-01'");
		$statement->bind_param("s", $id);
		$statement->execute();
		$result = $statement->get_result();
		 
		while($row = $result->fetch_assoc()) {
		  echo date("j", strtotime($row['DATUM'])), "&", $row['NR'], "&", date("H:i", strtotime($row['BEGINN'])), "&", $row['KATEGORIE'], "&", $row['LIGA'], ";";
		}
		
		mysqli_close($mysqli);
	}
?>