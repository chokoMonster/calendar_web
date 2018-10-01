<?php
	session_start();
	error_reporting(0);
	if(isset($_POST['datum']) && isset($_SESSION['user']))
	{
		$date = explode(".", $_POST['datum']);
		$datum = $date[2]."-".$date[1]."-".$date[0];
		$beginn = $_POST['beginn_h'].":".$_POST['beginn_min'];
		$ende = $_POST['ende_h'].":".$_POST['ende_min'];
		$gegner = trim($_POST['gegner']);
		$bemerkung = trim($_POST['bemerkung']);
		$passiv = "0";
		if(isset($_POST['passiv'])) {
			$passiv = $_POST['passiv'];
		}
		
		$mysqli = new mysqli("localhost", "root", "dbb", "dbb");
		if ($mysqli->connect_errno) {
			die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
		}

		if(empty($_POST['nr'])) {
			/*$sql = "select ifnull(min(id_neu), 1) as c from
					(
					SELECT (nr+1) AS id_neu
					FROM eintraege 
					WHERE benutzer='$_POST[benutzer]' and datum='$datum' 
						and (nr+1) NOT IN (SELECT nr FROM eintraege where  benutzer='$_POST[benutzer]' and datum='$datum')
					) e,
					(
					SELECT min(nr) as m 
					FROM eintraege 
					WHERE  benutzer='$_POST[benutzer]' and datum='$datum'
					) a
					where a.m=1";
			
			$statement = $mysqli->prepare($sql);*/

			$statement = $mysqli->prepare("select ifnull(min(id_neu), 1) as c from
					(
					SELECT (nr+1) AS id_neu
					FROM eintraege 
					WHERE benutzer=? and datum=? 
						and (nr+1) NOT IN (SELECT nr FROM eintraege where  benutzer=? and datum=?)
					) e,
					(
					SELECT min(nr) as m 
					FROM eintraege 
					WHERE  benutzer=? and datum=?
					) a
					where a.m=1");
			
			$statement->bind_param("ssssss", $_SESSION['user'], $datum, $_SESSION['user'], $datum,  $_SESSION['user'], $datum);

			$statement->execute();
			$result = $statement->get_result();

			while($row = $result->fetch_assoc()) {
				$nr = $row['c'];
			}
			
			/*$sql = "insert into eintraege (BENUTZER, DATUM, NR, PASSIV, BEGINN, ENDE, ALTERSKLASSE, KATEGORIE, LIGA, TRAINER, INTENSITAET, ART, GEGNER, BEMERKUNG) values
			('$_POST[benutzer]', '$datum', '$nr', '$passiv', '$beginn', '$ende', '$_POST[alter]', '$_POST[kategorie]', '$_POST[liga]', '$_POST[trainer]', 
			'$_POST[intensitaet]', '$_POST[art]', '$gegner', '$bemerkung')";*/

			$statement = $mysqli->prepare("insert into eintraege (BENUTZER, DATUM, NR, PASSIV, BEGINN, ENDE, ALTERSKLASSE, KATEGORIE, LIGA, TRAINER, INTENSITAET, ART, GEGNER, BEMERKUNG) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

			$statement->bind_param("ssssssssssssss", $_SESSION['user'], $datum, $nr, $passiv, $beginn, $ende, $_POST['alter'], $_POST['kategorie'], $_POST['liga'], $_POST['trainer'], $_POST['intensitaet'], $_POST['art'], $gegner, $bemerkung);
			
		} else {
			/*$sql = "update eintraege set BENUTZER='$_POST[benutzer]', DATUM='$datum', NR='$_POST[nr]', PASSIV='$passiv', BEGINN='$beginn', ENDE='$ende', ALTERSKLASSE='$_POST[alter]', 
			KATEGORIE='$_POST[kategorie]', LIGA='$_POST[liga]', TRAINER='$_POST[trainer]', INTENSITAET='$_POST[intensitaet]', ART= '$_POST[art]', GEGNER='$gegner', BEMERKUNG='$bemerkung'
			where benutzer='$_POST[benutzer]' and datum='$datum' and nr='$_POST[nr]'";*/

			$statement = $mysqli->prepare("update eintraege set BENUTZER=?, DATUM=?, NR=?, PASSIV=?, BEGINN=?, ENDE=?, ALTERSKLASSE=?, KATEGORIE=?, LIGA=?, TRAINER=?, INTENSITAET=?, ART=?, GEGNER=?, BEMERKUNG=? where benutzer=? and datum=? and nr=?");

			$statement->bind_param("sssssssssssssssss", $_SESSION['user'], $datum, $_POST['nr'], $passiv, $beginn, $ende, $_POST['alter'], $_POST['kategorie'], $_POST['liga'], $_POST['trainer'], $_POST['intensitaet'], $_POST['art'], $gegner, $bemerkung, $_SESSION['user'], $datum, $_POST['nr']);
		}	

		//$statement = $mysqli->prepare($sql);
		$statement->execute();
		mysqli_close($mysqli);
		echo 'ok';
		
	} else {
		echo "Fehler bei der Formular&uuml;bermittlung";
	}
?>