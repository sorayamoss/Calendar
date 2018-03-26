<?php
session_start();

if(empty($_SESSION['username'])){
  $currentUser= 'nouser';

}
else{
    $currentUser= $_SESSION['username'];
    // $token = $_SESSION['token'];
}

?>

<!DOCTYPE html>
<html>
<head>
  <title>Calendar</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="calstyle.css" type="text/css">

  <!-- hides diplay boxs for events -->
  <style>
  #mydialog { display:none }
  #myOtherDialog {display:none}
  #myInvitesDialog {display: none}
  </style>

  <!-- links to our jqery files -->
  <link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/start/jquery-ui.css"
  type="text/css" rel="Stylesheet" />
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
  <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.5/jquery-ui.min.js"></script>
  <script >

  // functions to show/hide our dialog boxes
  function showdialog()
  {
    $("#mydialog").dialog();
  }
  function hidedialog()
  {
    $("#mydialog").dialog("close");
  }

  function showOtherDialog()
  {
    $("#myOtherDialog").dialog();
  }
  function hideOtherDialog()
  {
    $("#myOtherDialog").dialog("close");
  }

  function showInvitesDialog()
  {
    $("#myInvitesDialog").dialog();
  }
  function hideInvitesDialog()
  {
    $("#myInvitesDialog").dialog("close");
  }

  </script>

  <!-- favicon link -->
  <link rel="shortcut icon" type="image/png" href="http://pluspng.com/img-png/calendar-icon-1600.png"/>
</head>
<body>

<!-- content section -->
  <div id="content">

    <!-- months, with buttons -->
    <div id="month"> <h1 id="month-name">month</h1>
      <button id="prev_btn" value="Previous Month"> < </button>
      <button id="next_btn" value="Next Month">></button>

      <!-- login button -->
      <div id="login">
        Username: <input type="text" id="username" name="username" placeholder="Username" required/> <br>
        Password: <input type="password" id="password" name="password" placeholder="Password" required/>


        <button type="submit" id="login_btn" value="Submit">Login</button>
        <button type="submit" id="register_btn" value="Submit">Register</button>
      </div>

      <!-- logout button -->
      <div id ="logout">
        <div id="logout_welcome">
        </div>
          <input type="button" value="Log Out" id="logOut" onclick=logMeOut() />
      </div>


        <input type="button" value="Invites" id="invites" onclick=showInvitesDialog() />


        <!-- form to accept or reject invited event -->
        <div id="myInvitesDialog" title="Pending Invitations" class="popup">
          <table id="invitesTable" style="width:100%">
            <tr>
              <th>Event Name</th>
              <th>Invited By</th>
              <th>Accept?</th>
            </tr>
          </table>


        </div>

      <!-- button to add event -->
      <input type="button" value="Add Event" id="aeButton" onclick=showdialog() />
      <div id="mydialog" title="Event Details" class="popup">Please enter your event details:
        Event Name:<input type="text" id="eventName" class="popup" required/>
        Date:<input type="date" id ="eventDate" class="popup" required/>
        Time:<input type="time"  id="eventTime" class="popup" required/>
        <!-- CSRF token -->
        <input id="aToken" type="hidden" name="token" value="<?php echo htmlentities($_SESSION['token']);?>" />

        <button type="submit" id="event" value="event" class="popup" onclick=hidedialog()>Add</button>
      </div>

      <!-- form to delete/update event -->
      <div id="myOtherDialog" title="Event Details" class="popup">Please change your event details:


        Change Name:<input type="text" id="updatedName" class="popup"/>
        Change Date:<input type="date" id ="updatedDate" class="popup"/>
        Change Time:<input type="time" id="updatedTime" class="popup"/>
        <button type="submit" id="update" value="event" class="popup" onclick=hideOtherDialog()>Update</button>
        <button type="submit" id="delete" value="event" class="popup" onclick=hideOtherDialog()>Delete</button>
        Share with:<input type="text" placeholder="Insert Username" id="invitedUser" class="popup"/>
        <button type="submit" id="share" value="event" class="popup" onclick=hideOtherDialog()>Share</button>
      </div>


    </div>

    <!-- table for calendar format -->
    <table style="width:100%">
      <tr>
        <th class="weekday" id="sunday">Sunday </th>
        <th class="weekday" id="monday">Monday </th>
        <th class="weekday" id="tuesday">Tuesday</th>
        <th class="weekday" id="wednesday">Wednesday </th>
        <th class="weekday" id="thursday">Thursday </th>
        <th class="weekday" id="friday">Friday </th>
        <th class="weekday" id="saturday">Saturday </th>
      </tr>
      <tr>
        <td class="day" ><ul id="1"></ul></td>
        <td class="day" ><ul id="2"></ul></td>
        <td class="day"><ul id="3"></ul></td>
        <td class="day" ><ul id="4"></ul> </td>
        <td class="day" ><ul id="5"></ul> </td>
        <td class="day" ><ul id="6"></ul> </td>
        <td class="day" ><ul id="7"></ul> </td>
      </tr>
      <tr>
        <td class="day" ><ul id="8"></ul> </td>
        <td class="day" ><ul id="9"></ul> </td>
        <td class="day"><ul id="10"></ul></td>
        <td class="day" ><ul id="11"></ul> </td>
        <td class="day" ><ul id="12"></ul> </td>
        <td class="day" ><ul id="13"></ul> </td>
        <td class="day" ><ul id="14"></ul> </td>
      </tr>
      <tr>
        <td class="day" ><ul id="15"></ul> </td>
        <td class="day" ><ul id="16"></ul> </td>
        <td class="day"><ul id="17"></ul></td>
        <td class="day" ><ul id="18"></ul> </td>
        <td class="day" ><ul id="19"></ul> </td>
        <td class="day" ><ul id="20"></ul> </td>
        <td class="day" ><ul id="21"></ul> </td>
      </tr>
      <tr>
        <td class="day" ><ul id="22"></ul> </td>
        <td class="day"><ul id="23"></ul> </td>
        <td class="day"><ul id="24"></ul></td>
        <td class="day" ><ul id="25"></ul> </td>
        <td class="day" ><ul id="26"></ul> </td>
        <td class="day" ><ul id="27"></ul> </td>
        <td class="day" ><ul id="28"></ul> </td>
      </tr>
      <!-- think about special case of february -->
      <tr id="week5">
        <td class="day"><ul id="29"></ul> </td>
        <td class="day" ><ul id="30"></ul> </td>
        <td class="day"><ul id="31"></ul></td>
        <td class="day" ><ul id="32"></ul> </td>
        <td class="day" ><ul id="33"></ul> </td>
        <td class="day" ><ul id="34"></ul> </td>
        <td class="day"><ul id="35"></ul> </td>
      </tr>
      <!-- this is for special case if there need to be 6 weeks shown -->
      <tr id="week6">
        <td class="day"><ul id="36"></ul> </td>
        <td class="day" ><ul id="37"></ul> </td>
        <td class="day"><ul id="38"></ul></td>
        <td class="day" ><ul id="39"></ul> </td>
        <td class="day" ><ul id="40"></ul> </td>
        <td class="day" ><ul id="41"></ul> </td>
        <td class="day"><ul id="42"></ul> </td>
      </tr>

    </table>
  </div>


<!-- link to javascript files -->
<script  src="jsCalLib.js"></script>
<script  src="calendar.js"></script> <!-- load the JavaScript file -->
<?php
if($currentUser=='nouser'){
  echo '<script>',
       'pageLoad();',
       '</script>'
  ;
}
else{
  echo '<script>',
       'document.getElementById("logout_welcome").innerHTML="<h2>Welcome '.htmlentities($currentUser).' </h2>";',
       'propogateCal();',
       'inviteButtonUpdate();',
       'loggedIn();',
       '</script>'
  ;
}
 ?>
</body>
</html>
