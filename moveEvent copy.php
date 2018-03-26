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
$iid = $_POST['id'];
//first take out data we need from Invitation
//delete Invitation
//create event based on data from invite
$stmt = $mysqli->prepare("SELECT iDate, iTitle, iTime FROM invitations WHERE (iid=?) AND (username=?)" );
if(!$stmt){
  printf("Query Prep Failed1: %s\n", $mysqli->error);
  exit;
}
// Bind the parameter
$stmt->bind_param('ss', $iid, $username);
//$user = $_POST['username'];
$stmt->execute();
$stmt->bind_result($date,$title,$time);
$stmt->fetch();
$stmt->close();
//end getting data
//begin deleting
$stmt = $mysqli->prepare("delete from invitations where (iid=?) AND (username=?) ");
if(!$stmt){
  printf("Query Prep Failed2: %s\n", $mysqli->error);
  exit;
}
$stmt->bind_param('is', $iid, $username);
$stmt->execute();
//end deleting
$stmt->close();
// adds new event to database based on invitation
$stmt = $mysqli->prepare("insert into events (username, eDate, eTime, title) values (?, ?, ?, ?)");
if(!$stmt){
	printf("Query Prep Failed3: %s\n", $mysqli->error);
	echo "Invalid Submission";
  echo json_encode(array(
    "success" => false,
    "message" => "Invalid submission"
  ));
	exit;
}

$stmt->bind_param('ssss', $username, $date, $time, $title);
$stmt->execute();
$stmt->close();

//start given code
	echo json_encode(array(
		"success" => true
	));
	exit;

?>
