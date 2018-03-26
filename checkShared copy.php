<?php
//no user input so no need for csRF
// login_ajax.php
//sets up an array that we will fill and each index will be the individual json of the line of sql returned
// $returnArray = array();
//takes in our database
require 'database.php';
// http only cookies
ini_set("session.cookie_httponly", 1);
//begin session
session_start();
$previous_ua = @$_SESSION['useragent'];
$current_ua = $_SERVER['HTTP_USER_AGENT'];

if(isset($_SESSION['useragent']) && $previous_ua !== $current_ua){
	die("Session hijack detected");
}else{
	$_SESSION['useragent'] = $current_ua;
}
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//$times=1;
//get variables from session and post
$username =$_SESSION['username'];

// Use a prepared statement
$stmt = $mysqli->prepare("SELECT COUNT(*) FROM invitations WHERE username=?" );

// Bind the parameter
$stmt->bind_param('s', $username);
//$user = $_POST['username'];
$stmt->execute();

$stmt->bind_result($numInvites);
$stmt->fetch();

//start given code
	echo json_encode(array(
		"success" => true,
		"iCount"=> htmlentities($numInvites)
	));
	exit;
?>
