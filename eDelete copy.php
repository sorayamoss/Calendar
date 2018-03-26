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
$username =$_SESSION['username'];
$eid = $_POST['id'];

// if(!hash_equals($_SESSION['token'], $_POST['token'])){
// 	die("Request forgery detected");
// }
// deletes an event from the database
$stmt = $mysqli->prepare("delete from events where (eid=?) AND (username=?) ");
if(!$stmt){
  printf("Query Prep Failed: %s\n", $mysqli->error);
  exit;
}

$stmt->bind_param('is', $eid, $username);

$stmt->execute();
$stmt->close();

//start given code
	echo json_encode(array(
		"success" => true
	));
	exit;

 ?>
