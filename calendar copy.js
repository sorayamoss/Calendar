var daDate = new Date();
// For our purposes, we can keep the current month in a letiable in the global scope
let currentMonth = new Month(daDate.getFullYear(), daDate.getMonth()); // March 2018
let monthName;
let onLogin= false;
//When page loaded run
document.addEventListener("DOMContentLoaded", updateCalendar, false);
//document.addEventListener("DOMContentLoaded", pageLoad, false);

//hides logout button and add event button on page load
//if page not loaded and no user yet
function pageLoad(){
	document.getElementById("logout").style.visibility="hidden";
	document.getElementById("aeButton").style.visibility="hidden";
	document.getElementById("invites").style.visibility="hidden";
}
function loggedIn(){
		document.getElementById("login").style.visibility="hidden";
}




//on click event listeners for buttons in top of page
document.getElementById("login_btn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click
document.getElementById("event").addEventListener("click", eventAdd, false);
document.getElementById("register_btn").addEventListener("click", registerAjax, false); // Bind the AJAX call to button click
document.getElementById("invites").addEventListener("click", propogateShared, false);

// Change the month when the "next" button is pressed
document.getElementById("next_btn").addEventListener("click", function(event){
	currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	propogateCal();
	//alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);



// Change the month when the "next" button is pressed
function logMeOut(){
	let dataString = "nothing=" + encodeURIComponent(currentMonth);
	let xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
	xmlHttp.open("POST", "logout.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST
	xmlHttp.addEventListener("load", function(event){
		//console.log("five");
		let jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
		//alert(jsonData);
		if(jsonData.success){
			alert("You have been logged out");
			document.getElementById("logout").style.visibility="hidden";
			document.getElementById("aeButton").style.visibility="hidden";
			document.getElementById("invites").style.visibility="hidden";
			document.getElementById("login").style.visibility="visible";
			document.getElementById("username").value="";
			document.getElementById("password").value="";
			document.getElementById("invites").value= "Invites";
			updateCalendar();
			propogateCal();
	}
},false);
xmlHttp.send(dataString); // Send the data
}


// Change the month when the "next" button is pressed
document.getElementById("prev_btn").addEventListener("click", function(event){
	currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	//alert("The new month is "+currentMonth.month+" "+currentMonth.year);
	propogateCal();
}, false);


// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionaly using jQuery) to display the days and weeks in the current month.
//updates the calendar with the dates of each month
//updates what the calendar looks like.  Any user can see this
function updateCalendar(){
	//depends on how many weeks in month
	if(currentMonth.getWeeks().length>5){
		document.getElementById("week6").style.visibility="visible";
		document.getElementById("week5").style.visibility="visible";
		//alert("visible");
	}
	else if(currentMonth.getWeeks().length>4){
		document.getElementById("week6").style.visibility="hidden";
		document.getElementById("week5").hidden=false;
		//alert("hidden");
	}
	else{
		document.getElementById("week6").style.visibility="hidden";
		document.getElementById("week5").hidden=true;
	}
	// changes so we can read out month
	convertMonth(currentMonth.month);
	document.getElementById("month-name").innerText=monthName;
	document.getElementById("month-name").innerText+=", "+currentMonth.year;
	let weeks = currentMonth.getWeeks();
	let i =0;
	// go through weeks
	for(let w in weeks){
		if(w!==null){
			let days = weeks[w].getDates();
			// days contains normal JavaScript Date objects.
			//alert("Week starting on "+days[0]);
			for(let d in days){
				if(d!==null){
					document.getElementsByClassName("day")[i].innerHTML=days[d].getDate();
					document.getElementsByClassName("day")[i].innerHTML+="<ul id='"+ (i+1) + "'></ul>";
					i++;}
				}
			}
		}
	}
	// propogate the box with shared invites when button for invite is pushed
	function propogateShared(){
		$.ajax({
			type: "post",
			url: "showShared.php",
			dataType : 'JSON',
			cache: "false",
			data: {},
			success: function(data){
				console.log(data);  // for testing only
				data=$.parseJSON(data);
				jQuery.each(data, function(index, value){
					// document.getElementById("myInvitesDialog").innerHTML+="<br/>";
					// document.getElementById("myInvitesDialog").innerText+=value.title+", "+value.invitedBy;
					const row = document.createElement("tr");
					const eNameBox = document.createElement("td");
					const iByBox = document.createElement("td");
					const accept = document.createElement("td");
					eNameBox.appendChild(document.createTextNode(value.title));
					iByBox.appendChild(document.createTextNode(value.invitedBy));
					// each invitation it has an accept button with a unique id
					accept.innerHTML= '<button type="submit" id="'+value.id+'SamRocks" value="accept"  onclick=hideInvitesDialog()>Accept</button>';
					row.appendChild(eNameBox);
					row.appendChild(iByBox);
					row.appendChild(accept);
					document.getElementById("invitesTable").appendChild(row);
					//if clicked then move from invitations database to events database
					document.getElementById(value.id+"SamRocks").addEventListener("click", function(){
						// Make a URL-encoded string for passing POST data:
						let dataString3 = "id=" + encodeURIComponent(value.id);
						let xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
						xmlHttp.open("POST", "moveEvent.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
						xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST
						xmlHttp.addEventListener("load", function(event){
							let jsonData3 = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
							if(jsonData3.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
onLogin=false;
updateCalendar();
							propogateCal();
							alert("Your invitation has been added to your calendar");
							// update how the event button looks
							inviteButtonUpdate();
						}else{
							alert("sorry didn't go so well  "+jsonData.message);
						}
					}, false); // Bind the callback to the load event
					xmlHttp.send(dataString3); // Send the data
				}, "false");
				//end of event listener for delete button
			});
		}
	});
}


//converts month from number to name
function convertMonth(m){
	if (m===0){
		monthName="January";
	}
	else if(m==1){
		monthName="February";
	}
	else if(m==2){
		monthName="March";
	}
	else if(m==3){
		monthName="April";
	}
	else if(m==4){
		monthName="May";
	}
	else if(m==5){
		monthName="June";
	}
	else if(m==6){
		monthName="July";
	}
	else if(m==7){
		monthName="August";
	}
	else if(m==8){
		monthName="September";
	}
	else if(m==9){
		monthName="October";
	}
	else if(m==10){
		monthName="November";
	}
	else{
		monthName = "December";
	}

}

//start of ajax login javascript code
function loginAjax(event){
	let username = document.getElementById("username").value; // Get the username from the form
	//alert(username);
	let password = document.getElementById("password").value; // Get the password from the form
	console.log(username);
	// Make a URL-encoded string for passing POST data:
	let dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
	let xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance

	xmlHttp.open("POST", "login_aj.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST
	xmlHttp.addEventListener("load", function(event){
		//console.log("five");
		let jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
		//alert(jsonData);
		if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
		document.getElementById("login").style.visibility="hidden";
		//TODO: need to add escape user supply string
		document.getElementById("logout_welcome").innerHTML="<h2>Welcome "+ jsonData.username+"</h2>";
		document.getElementById("logout").style.visibility="visible";
		document.getElementById("aeButton").style.visibility="visible";
		document.getElementById("invites").style.visibility="visible";


		//checking the number of shared events with user
		let dataString2 = "username=" + encodeURIComponent(jsonData.username);
		let xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
		xmlHttp.open("POST", "checkShared.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST
		xmlHttp.addEventListener("load", function(event){
			let jsonData2 = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
			if(jsonData2.success){
				// initially pulled
				document.getElementById("invites").value+= " (" + jsonData2.iCount + ")";
			}
		}, false); // Bind the callback to the load event
		xmlHttp.send(dataString2); // Send the data
		onLogin=true;
		updateCalendar();
		propogateCal();
		// hideOtherDialog();
	}else{
		alert("You were not logged in.  "+jsonData.message);
	}
}, false); // Bind the callback to the load event
xmlHttp.send(dataString); // Send the data
}



//end of ajax logim javascript code


//beginning of ajax register javascript code

function registerAjax(event){
	let username = document.getElementById("username").value; // Get the username from the form
	//alert(username);
	let password = document.getElementById("password").value; // Get the password from the form

	console.log(username);
	// Make a URL-encoded string for passing POST data:
	let dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
	let xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance

	xmlHttp.open("POST", "register_aj.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST
	xmlHttp.addEventListener("load", function(event){
		let jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
		if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
		alert("You've been Registered! You can now log in. :)");
		document.getElementById("username").value="";
		document.getElementById("password").value="";
		// document.getElementById("login").style.visibility="hidden";
		// document.getElementById("logout").innerHTML+="<h2>Welcome "+ username+"</h2>";
		// document.getElementById("logout").style.visibility="visible";
	}else{
		alert("You were not registered.  "+jsonData.message);
	}
}, false); // Bind the callback to the load event
xmlHttp.send(dataString); // Send the data
}


//end of ajax register javascript code

//beginning of logged in javascript code


//this function loads the events on the calendar
function propogateCal(){
	updateCalendar();
	$('ul').empty();
	let weeks = currentMonth.getWeeks();
	let j=1;
	for(let w in weeks){
		if(w!==null){

			let days = weeks[w].getDates();
			//console.log("this is where j is at");
			//console.log(j);
			// days contains normal JavaScript Date objects.
			//alert("Week starting on "+days[0]);
			for(let d in days){
				if(d!==null){
					// You can see console.log() output in your JavaScript debugging tool, like Firebug,
					// WebWit Inspector, or Dragonfly.
					let date = days[d].toISOString().substring(0,10);
					//let dataString = "date=" + encodeURIComponent(date)+"&j="+encodeURIComponent(j);
					// let xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance

					// xmlHttp.open("POST", "checkEvent.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
					// xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST
					// xmlHttp.addEventListener("load", function(event){
					// looked up on google how to iterate through array ajax
					// https://stackoverflow.com/questions/31514909/jquery-ajax-how-to-loop-through-array-as-part-of-ajax-success-function
					//let jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
					$('#' + j).empty();
					pullTheData(j, date);
		// 	//alert("six");
		// }, false); // Bind the callback to the load event
		// xmlHttp.send(dataString); // Send the data
		j++;
	}//end for the days
}
}
}
}








function pullTheData(j, date){


	$.ajax({
		type: "post",
		url: "checkEvent.php",
		dataType : 'JSON',
		cache: "false",
		data: {
			date: date,
			j: j
		},
		success: function(data){
			console.log(data);  // for testing only
			data=$.parseJSON(data);
			jQuery.each(data, function(index, value){

				//					if(jsonData.success && jsonData.dataDate==date){

				//TODO: need to add escape user supply string
				//document.getElementById(value.j).innerHTML+="<br/>";
				//document.getElementById(value.j).innerText+=value.title+", "+value.time;

				// alert(value.dataDate.substring(8,10));
				//alert(daDate.getDate());
				//alert(onLogin);
				if(((value.dataDate.substring(8,10))==(daDate.getDate()))&&onLogin&&((value.dataDate.substring(5,7))==(daDate.getMonth()+1))&&((value.dataDate.substring(0,4))==(daDate.getFullYear()))){
					alert("You have an event today and it is:  "+ value.title);
				}
				console.log(value);
				//const dateBox = document.getElementById(value.j);
				const dateListItem = document.createElement("li");
				dateListItem.appendChild(document.createTextNode(value.title+", "+value.time));
				dateListItem.setAttribute("id", value.j + "-" + index);
				const box = document.getElementById(value.j);


				document.getElementById(value.j).appendChild(dateListItem);


				//updating/deleting events functions
				document.getElementById(value.j + "-" + index).addEventListener("click", function(){
					showOtherDialog();

					document.getElementById("updatedName").value=value.title;
					document.getElementById("updatedTime").value=value.time;
					document.getElementById("updatedDate").value=value.dataDate;




					//addEventListener for delete button
					document.getElementById("delete").addEventListener("click", function(){

						let token = document.getElementById("aToken").value;
						// Make a URL-encoded string for passing POST data:
						let dataString = "id=" + encodeURIComponent(value.id) + "&token=" + encodeURIComponent(token);
						let xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
						xmlHttp.open("POST", "eDelete.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
						xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST
						xmlHttp.addEventListener("load", function(event){
							let jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
							if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
							onLogin=false;
							updateCalendar();
							propogateCal();
							//alert("Your event has been deleted");
							document.getElementById("updatedName").value="";
							document.getElementById("updatedTime").value="";
							document.getElementById("updatedDate").value="";
							document.getElementById("invitedUser").value="";
						}else{
							alert("sorry didn't go so well  "+jsonData.message);
							document.getElementById("updatedName").value="";
							document.getElementById("updatedTime").value="";
							document.getElementById("updatedDate").value="";
							document.getElementById("invitedUser").value="";
						}
					}, false); // Bind the callback to the load event
					xmlHttp.send(dataString); // Send the data
					hideOtherDialog();
				}, "false");
				//end of event listener for delete button




				//addEventListener for update button
				document.getElementById("update").addEventListener("click", function(){
					// Make a URL-encoded string for passing POST data:
onLogin=false;
					let name= document.getElementById("updatedName").value;
					let time= document.getElementById("updatedTime").value;
					let date= document.getElementById("updatedDate").value;
					let token = document.getElementById("aToken").value;
					// alert(token);
					let dataString = "name=" + encodeURIComponent(name) + "&time=" + encodeURIComponent(time)+ "&date=" + encodeURIComponent(date) + "&id=" + encodeURIComponent(value.id) + "&token=" + encodeURIComponent(token);
					let xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
					xmlHttp.open("POST", "eUpdate.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
					xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST
					xmlHttp.addEventListener("load", function(event){
						let jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
						if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
						onLogin=false;
						updateCalendar();
						propogateCal();
						//alert("Your event has been updated");
						document.getElementById("updatedName").value="";
						document.getElementById("updatedTime").value="";
						document.getElementById("updatedDate").value="";
						document.getElementById("invitedUser").value="";
					}else{
						alert("sorry didn't go so well  "+jsonData.message);
						document.getElementById("updatedName").value="";
						document.getElementById("updatedTime").value="";
						document.getElementById("updatedDate").value="";
						document.getElementById("invitedUser").value="";
					}
				}, false); // Bind the callback to the load event
				xmlHttp.send(dataString); // Send the data
				hideOtherDialog();
			}, "false");
			//end of event listener for update button




			//addEventListener for share button
			document.getElementById("share").addEventListener("click", function(){
				// Make a URL-encoded string for passing POST data:
onLogin=false;
				let iname= document.getElementById("updatedName").value;
				let itime= document.getElementById("updatedTime").value;
				let idate= document.getElementById("updatedDate").value;
				let iuser= document.getElementById("invitedUser").value;
				let token = document.getElementById("aToken").value;

				let dataString = "name=" + encodeURIComponent(iname) + "&time=" + encodeURIComponent(itime)+ "&date=" + encodeURIComponent(idate) + "&iuser=" + encodeURIComponent(iuser) + "&token=" + encodeURIComponent(token);
				let xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
				xmlHttp.open("POST", "eShare.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
				xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST
				xmlHttp.addEventListener("load", function(event){
					let jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
					if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
onLogin=false;
					updateCalendar();
					propogateCal();
					document.getElementById("updatedName").value="";
					document.getElementById("updatedTime").value="";
					document.getElementById("updatedDate").value="";
					document.getElementById("invitedUser").value="";
					//alert("Your event has been updated");
				}else{
					alert("sorry didn't go so well  "+jsonData.message);
					document.getElementById("updatedName").value="";
					document.getElementById("updatedTime").value="";
					document.getElementById("updatedDate").value="";
					document.getElementById("invitedUser").value="";
				}
			}, false); // Bind the callback to the load event
			xmlHttp.send(dataString); // Send the data
			hideOtherDialog();
		}, "false");
		//end of event listener for share button

		// document.getElementById(value.j + "-" + index).addEventListener("click", showOtherDialog(), "false");
		//end event addEventListener for individual event press
	}, "false");
	// document.getElementById(value.j + "-" + index).addEventListener("click", showOtherDialog(), "false");
});
}

});
}










//function to add events to the calendar/database
function eventAdd(){
onLogin=false;
	let name= document.getElementById("eventName").value;
	let time= document.getElementById("eventTime").value;
	let date= document.getElementById("eventDate").value;
	let token = document. getElementById("aToken").value;


	if (name==="" || time==="" || date===""){
		alert("Invalid event submission. Try again");
		return;
	}
	// if(date=="0000-00-00"||time=="00:00:00"){
	// 	alert("invalid time or date added");
	// }
	// else{
	// Make a URL-encoded string for passing POST data:
	let dataString = "name=" + encodeURIComponent(name) + "&time=" + encodeURIComponent(time)+ "&date=" + encodeURIComponent(date) + "&token=" + encodeURIComponent(token);
	let xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance

	xmlHttp.open("POST", "eAdd.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST
	xmlHttp.addEventListener("load", function(event){
		//console.log("five");
		let jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
		//alert("six");
		if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
		alert("Your event has been added");
onLogin=false;
updateCalendar();
		propogateCal();
		document.getElementById("eventName").value="";
		document.getElementById("eventTime").value="";
		document.getElementById("eventDate").value="";
	}else{
		alert("sorry didn't go so well  "+jsonData.message);
		document.getElementById("eventName").value="";
		document.getElementById("eventTime").value="";
		document.getElementById("eventDate").value="";
	}
}, false); // Bind the callback to the load event
xmlHttp.send(dataString); // Send the data
//propogateCal();
// }

}

//end of logged in javascript code


function inviteButtonUpdate(){
	let user="fouseUser";
	let dataString29 = "username=" + encodeURIComponent(user);
	//checking the number of shared events with user
	let xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
	xmlHttp.open("POST", "checkShared.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST
	xmlHttp.addEventListener("load", function(event){

		let jsonData2 = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
		if(jsonData2.success){
			document.getElementById("invites").value= "Invites (" + jsonData2.iCount + ")";
		}
	}, false); // Bind the callback to the load event
	// hideOtherDialog();
	xmlHttp.send(dataString29); // Send the data
}
