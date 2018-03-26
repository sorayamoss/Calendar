<?php
// login_ajax.php
require 'database.php';

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

$user = $_POST['username'];
$pwd_guess = $_POST['password'];

// Use a prepared statement
$stmt = $mysqli->prepare("SELECT COUNT(*), password FROM users WHERE username=?");

// Bind the parameter
$stmt->bind_param('s', $user);
//$user = $_POST['username'];
$stmt->execute();

// Bind the results
$stmt->bind_result($cnt, $pwd_hash);
$stmt->fetch();

//$pwd_guess = $_POST['password'];
// Compare the submitted password to the actual password hash

if($cnt == 1 && password_verify($pwd_guess, $pwd_hash)){
  // Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
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
	$_SESSION['username'] = $user;
  //TODO MIght not need
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));

//start given code
	echo json_encode(array(
		"success" => true,
		"username"=> $_SESSION['username']
	));
	exit;
}else{
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}
?>
