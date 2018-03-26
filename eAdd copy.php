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
$name = $_POST['name'];
$time = $_POST['time'];
$date = $_POST['date'];

//$regexdate = "/[a-zA-Z]+ \d+/";
//$regextime = "/[a-zA-Z]+ \d+/";

// if(!hash_equals($_SESSION['token'], $_POST['token'])){
// 	die("Request forgery detected");
// }
// adds new event to database
$stmt = $mysqli->prepare("insert into events (username, eDate, eTime, title) values (?, ?, ?, ?)");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	echo "Invalid Submission";
  echo json_encode(array(
    "success" => false,
    "message" => "Invalid submission"
  ));
	exit;
}

$stmt->bind_param('ssss', $username, $date, $time, $name);

$stmt->execute();

$stmt->close();

//start given code
	echo json_encode(array(
		"success" => true
	));
	exit;

?>
