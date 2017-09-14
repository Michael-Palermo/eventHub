// Google API Key
var apiKey = 'AIzaSyAEgVTABuoJteYHqrlpGO1aQ1TehkBg8X0';
var lat = "";
var long = "";
var mapOptions = {};
var im = "";

function initialize(location)
		{
				console.log(location);
				// var for circle image
				im = "assets/images/bluecircle.png";
				// Create variable for map options
				mapOptions = {
					center: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
					zoom: 12,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				// Create new map in jumbotron with id 'map-canvas'
				var map = new google.maps.Map(document.getElementById("map-canvas"),
						mapOptions);

				var userMarker = new google.maps.Marker({
			            position: mapOptions.center,
			            map: map,
			            icon: im
			        });		

      }



$(document).ready(function()
		{
				navigator.geolocation.getCurrentPosition(initialize);

		
// Grab input value from ***City Search*** bar and store as a variable ***Global***

// Convert var into proper string to search Google Maps Api

// Display new map with marker

// Use same variable to search Eventful API

// Append the results to the 'events' div

//Firebase entry of recent user searches

// Initialize Firebase
  var config = 
  			{
    apiKey: "AIzaSyCWK0pIiNd4lVSgBUbuU6-B-FargYoYPyo",
    authDomain: "apiproject1-dad7d.firebaseapp.com",
    databaseURL: "https://apiproject1-dad7d.firebaseio.com",
    projectId: "apiproject1-dad7d",
    storageBucket: "",
    messagingSenderId: "703597396756"
  			};

  firebase.initializeApp(config);

  var database = firebase.database();
// Store user input in firebase
  $("#add-city").on("click", function() {
        var city = $("#city-input").val().trim();
        database.ref().push({
            city: city,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
        //Return input to original placeholder
        $("#city-input").val("City...");
          // prevent page from refreshing when user hits enter
        
        console.log(city);
        // API call for the weather
		var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ad2049df345f2733661921d3ca7a05f5";
        
        // Performing our AJAX GET request
	    $.ajax({
	    	  url: weatherURL,
	       	  method: "GET",
	       	  //New Google map based off user input
	       	  success: function (response) 
					{

					// create var for latitude from API weather response
					lat = response.coord.lat;
					console.log(lat);
					// create var for longitude from API weather response
					long = response.coord.lon;
					mapOptions = {
						center: new google.maps.LatLng(lat, long),
						zoom: 12,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};

					var latlng = new google.maps.LatLng(lat, long);
					var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
					im = "assets/images/bluecircle.png";
					var userMarker = new google.maps.Marker({
			            position: mapOptions.center,
			            map: map,
			            icon: im
			        });		
					}
			  		})	       	 
	        // After the data comes back from the API
	        .done(function(response) {

					console.log(response);
					var main = response.main.temp;
					var insertBreak = $("<br>");
					var currentConditions = response.weather[0].description;
					
					var mainDisplay = $('#weather').html("Temperature: "  + parseInt((1.8*(main - 273) + 32)) + "&#8457");
					
					var insertBreak = $('#weather').append(insertBreak);
					var ccDisplay = $('#weather').append("Current Conditions: "  + currentConditions);
					
					
				})
	        
	        .fail(function(error){
	        	console.log("error", error);
	        	});

					

		// End Weather GET
	    
	    // console log city to see if we get back before event API
	        console.log(city);
	        
	    var eventURL = "https://api.eventful.com/json/events/search?location=" + city + "&app_key=wwBJT6fHmcLQCH4G";
	    // Begin Event GET
		$.ajax({
	    	  url: eventURL,
	       	  method: "GET",
	       	  dataType: "json"
	       	  })
	        // After the data comes back from the API
	        .done(function(response) {
					console.log("response", response);
					// Get event details from response
					console.log(response.events.event[0].title);
					console.log(response.events.event[0].venue_url);
					// create variable equal to $("<div>");
					var events = $("<div>");
					//Create for loop for the data we want to extract
					for (var i = 0; i < response.events.event.length; i++) {
					
				
						//create new div for each event and image
						
							
						var image = response.events.event[i].image ? response.events.event[i].image.medium.url : null;

						var imageCall = $("<img class='event-image'>").attr("src", image);

							if (image === null) {
								var imageBackUp = $("<img>").attr("src", "assets/images/events_medium.jpg");
								events.append(imageBackUp);
							}
							else {
								events.append(imageCall);
							}
						//create variable for event title
						var title = response.events.event[i].title;
						//append title
						var titleCall = $("<h2>").html(title);	
						    events.append(titleCall);	
						//create variable for the venue information	
						var venueName = response.events.event[i].venue_name;
						//append venue info
						var venNameCall = $("<h3>").html(venueName);
						    events.append(venNameCall);	
						//create variable for the city
						var city = response.events.event[i].city_name;
						//create variable for the state
						var state = response.events.event[i].region_name;
						//create variable for the state
						var address = response.events.event[i].venue_address;
						//append event info to div
						var addressCall = $("<p>").html("Event Address: " + address + '<br>' + city + ", " + state);
						    events.append(addressCall);
						//create variable for link to event
						var url = response.events.event[i].venue_url;
						var urlCall = $("<a href=url target='_blank'><p>").html("Event Link: Click Here" + '<br>');
					    events.append(urlCall);
						console.log(events);
							}

				$("#events").append(events);
		
           	})
	        .fail(function(error){
	        	console.log("error", error);
	        });	    

            });



// when user input is added to Firebase, append the stored values to the page
 database.ref().orderByChild("dateAdded").limitToLast(5).on("child_added", function(childSnapshot) 
	{
     	// clean TIMESTAMP server value using moment.js
    	var cleanTime = moment(childSnapshot.val().dateAdded).format('MMMM Do YYYY, h:mm:ss a');
    	// append added city and cleanTime to Table
    	$(".added-city").append("<tr>+<td>" + childSnapshot.val().city + "<td>" + cleanTime + "<td>");
    });

});
   



