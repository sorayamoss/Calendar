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
$eid = $_POST['id'];

// if(!hash_equals($_SESSION['token'], $_POST['token'])){
// 	echo "session variable:";
// 	echo $_SESSION['token'];
// 	echo "post token";
// 	echo $_POST['token'];
// 	die("Request forgery detected");
// }
// updates event in database
$stmt = $mysqli->prepare("update events set eDate = '".$date."', eTime='".$time."', title='".$name."' where eid='".$eid."' AND username='".$username."'");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	echo "Invalid Submission";
  echo json_encode(array(
    "success" => false,
    "message" => "Invalid submission"
  ));
	exit;
}

//$stmt->bind_param('sss', $date, $time, $name);

$stmt->execute();

$stmt->close();

//start given code
	echo json_encode(array(
		"success" => true
	));
	exit;

?>
