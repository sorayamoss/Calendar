<?php
// login_ajax.php
//sets up an array that we will fill and each index will be the individual json of the line of sql returned
$returnArray = array();
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
$date = $_POST['date'];
$username= $_SESSION['username'];
$j=$_POST['j'];

// Use a prepared statement
$stmt = $mysqli->prepare("SELECT eDate, title, eTime, eid FROM events WHERE (eDate=?) AND (username=?)" );

// Bind the parameter
$stmt->bind_param('ss', $date, $username);
//$user = $_POST['username'];
$stmt->execute();

// // Bind the results
// $stmt->bind_result($countE, $dataDate, $title, $time);
// //initialize array
// $stmt->fetch();

// loosely used https://stackoverflow.com/questions/37041454/php-iterate-through-every-row
//used it to help with next two lines.  To be honest I tried to loop through every row so many ways and this is all I could find
$result=$stmt->get_result();
	while($row = $result->fetch_assoc()) {
		//make sure only to go through lines where its not null
		if($row["title"]!=null && $row["eTime"]!= null){
			//temp array is just indiviual events json on a particular date
			// date regular expression
			//$safe_date = preg_match('/\d{4}-\d{2}-\d{2}/', $row["eDate"];
			$tempArray =array(
				"success" => true,
				"dataDate" => htmlentities($row["eDate"]),
				"title" => htmlentities($row["title"]),
				"time" => htmlentities($row["eTime"]),
				"id" => htmlentities($row["eid"]),
				"j" => $j
			);
			// http://php.net/manual/en/function.array-push.php
			// This method just adds the element to an array of length one more
		array_push($returnArray,$tempArray);//fill return each with array json elements
		}else{
			// echo json_encode(array(
			// 	// "success" => false,
			// 	// "message" => "No event on this day"
			// ));
		}
	}
//$pwd_guess = $_POST['password'];
// Compare the submitted password to the actual password hash
//this sends back the array with all of the indiviual events from that date
echo json_encode($returnArray);
exit;
?>
