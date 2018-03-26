<?php
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
// http only cookies
ini_set("session.cookie_httponly", 1);
session_start();
$previous_ua = @$_SESSION['useragent'];
$current_ua = $_SERVER['HTTP_USER_AGENT'];

if(isset($_SESSION['useragent']) && $previous_ua !== $current_ua){
	die("Session hijack detected");
}else{
	$_SESSION['useragent'] = $current_ua;
}
$username = $_POST['username'];
$password = $_POST['password'];

// password hashing
$hashedpassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");

// Bind the parameter
$stmt->bind_param('s', $username);
//$user = $_POST['username'];
$stmt->execute();
// Bind the results
$stmt->bind_result($cnt);
$stmt->fetch();
if($cnt>0){
	// printf("Query Prep Failed: %s\n", $mysqli->error);
	// echo "Invalid Username";
	echo json_encode(array(
		"success" => false,
		"message" => "Invalid username submission"
	));
	exit;
}
else{
	$stmt->close();
	// adds new user to database
	$stmt = $mysqli->prepare("insert into users (username, password) values (?, ?)");
	if(!$stmt){
		// printf("Query Prep Failed: %s\n", $mysqli->error);
		// echo "Invalid Username";
	  echo json_encode(array(
	    "success" => false,
	    "message" => "Invalid username submission"
	  ));
		exit;
	}

	$stmt->bind_param('ss', $username, $hashedpassword);

	$stmt->execute();

	$stmt->close();

	//start given code
		echo json_encode(array(
			"success" => true
		));
		exit;

}

?>
