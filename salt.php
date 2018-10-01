<?php 
	if (isset($_POST['user']))  { 
	 
		$mysqli = new mysqli('localhost', 'root', 'dbb', 'dbb');
	 
		#$statement = $mysqli->prepare("delete from tmp_salts where timestamp < (NOW() - INTERVAL 10 DAY)");
		#$statement->execute();
	 
		$statement = $mysqli->prepare("select passwort from teilnehmer where benutzer=?");
		$statement->bind_param("s", $_POST['user']);
		$statement->execute();
		$result = $statement->get_result();
	 
		if ($result->num_rows == 1) {
			$row = mysqli_fetch_assoc($result);
			echo substr($row['passwort'], 0, 29);
			
		} /*else {
			$statement = $mysqli->prepare("select salt from tmp_salts where benutzer=?");
			$statement->bind_param("s", $_POST['user']);
			$statement->execute();
			$result = $statement->get_result();
	 
			if ($result->num_rows == 1) { 
				$row = mysqli_fetch_assoc($result);
				echo $row['salt'];
				
			} else {
				$options = ['cost' => 13,];
				$base = password_hash ('', PASSWORD_BCRYPT, $options);
				$salt = "$2a$13$" . substr($base, 8, 30);
	 
				$statement = $mysqli->prepare("insert into tmp_salts (benutzer, salt) values (?, ?)");
				$statement->bind_param("ss", $_POST['user'], $salt);
				$statement->execute();
	 
				echo $salt;
			}
		}*/
		mysqli_close($mysqli);
	}
?>