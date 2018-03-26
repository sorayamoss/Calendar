# Hello and Welcome to Soraya and Sam's Calendar



Please Click on the Icon below to get to our News Site
[![N|Solid|512x397,20%](https://image.flaticon.com/icons/png/512/55/55281.png)](http://ec2-18-220-49-137.us-east-2.compute.amazonaws.com/~sorayamoss/calendar.php)

#### Our Creative Portion!
For our creative portion, we decided to allow the user to invite other users to an event on their page! The user has the ability to directly click the event they would like to share, then input the username of the user they would like to share the event with, then hit share. If a user is invited to an event, then when the user logs into their calendar, there is a "Pending Invitations" box that displays the number of events they have been invited to. The user can then click on their "Pending Invitations" button to display a popup that displays the event titles, along with the user that invited them as well as an "accept" button to accept the invitation to the event. By pressing the accept button, the event is deleted from that user's invitations and added to that user's calendar. A user can only be invited to an event one time and the invited event can only be added to the user's calendar one time. The number of invites in the "Pending Invitations" button is also updated upon pressing the "accept" button to an event.

In order to make this possible, we created a new database called "invitations" so that when one user invites another user, the invitation is added to the invitations database. We were able to provide the number of invitations each user has to update the Pending Invitations box by selecting the COUNT of all values in the invitations database that match the session username. Then, we were able to select all the events that match the session username when the events are being displayed. When a user accepts an invitation, the event is deleted from the invitations database and added to the events database under that users name.

I know this seems somewhat like "Users can create group events that display on multiple users calendars (5 points)" but that is 1/10th of this creative portion.  The files that you should look at for this creative portion are calendar.js(propogateShared(),loginAjax(event), line 408) checkShared.php, moveEvent.php, and
show Shared.php.  In addition look through the invitations database.  To do this we has an updating button with the number of invitations pending.  Updated invitations and deleted from that database and added an event to the events database.  I am confident this is at least 3x larger than any of the suggested creative portions so although it is only 1 thing it should still be 15 points.


Added more to creative.  Now when a user logs in if they have an event on that day it alerts them that that event is that day.  It only happens on login.  It pulls the current date from Date js object

Name and Student ID
  - Sam Margolis 448767
  - Soraya Moss 450267

 Login information
 username: sam pass: sam
 username: t pass: t
