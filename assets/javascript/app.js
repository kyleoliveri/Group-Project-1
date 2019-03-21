$(document).ready(function () {
    // Firebase
    var config = {
        apiKey: "AIzaSyDhX3eoKqB9FaOcBx9UuhH_gdQ8Eh2D6Ho",
        authDomain: "tavel-app.firebaseapp.com",
        databaseURL: "https://tavel-app.firebaseio.com",
        projectId: "tavel-app",
        storageBucket: "tavel-app.appspot.com",
        messagingSenderId: "1098746254883"
      };

    firebase.initializeApp(config);
      
    var database = firebase.database();

    // Stylized search button
    $('.search-button').click(function(){
        $(this).parent().toggleClass('open');
    });

    // NY TIMES queryURL for API
    var newsURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

    var weatherFn = function (data) {
        console.log("hello");
        var ul = $('<ul>');
        var weather = data.list;
        for (var i = 0; i < 10; i++){
            var li = $('<li>');
            li.text(weather[i].main.temp);
            // Must turn into F
            ul.append(li);
        }
        $('#weather').append(ul);
        console.log(weather);
    };
  
    var ticketFn = function (data) {
        console.log(data._embedded);
        var ul = $('<ul>');
        var events = data._embedded.events;
        
        for (var i = 0; i < 10; i++){
            var li = $('<li>');
            li.text(events[i].name);
            ul.append(li);
        }
        $('#event').append(ul);
        console.log(events);

        // for(var i =0; i < cities.length; i++) {
        // console.log(cities[i]);   
        // }
    };

    var newsFn = function (data) {
        //console.log(data);
    };
    // var meetupFn = function (data) {
    //     console.log(data);
    // };

    var getData = function (url, callback) {
        $.ajax({
            url: url,
            method: "GET"
        }).then(function (response) {
            callback(response);
        });
    };

    $("#search-btn").on("click", function (event) {
        event.preventDefault();

        var location = $('#search-city').val().trim();

        var ticketURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + location + "&apikey=GUGxZfyhbML7wYGWnG6WJgswr520dPab";
        var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=ee154728981041b7ff67246fa7ea0282&q=" + location;
        
        // function getData(location) {
        //     var url = 'https://api.meetup.com/find/locations?key=4634397cf20a66185218066375c3d&query=' + location;
        //     console.log(url);
        
        //     fetch(url, {
        //         method: 'GET'
        //     })
        //     .then(data => {
        //         console.log(data)
        //     })
        // }
        
        // getData('Huston')
        // /find/upcoming_events  radius=5

        getData(ticketURL, ticketFn);
        getData(weatherURL, weatherFn);
        // getData(meetupURL, meetupFn);

        ////// NEWS API ///////
        var newsParams = {
            "api-key":
                "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M"
        };

        newsParams.q = location;

        var queryURL = newsURL + $.param(newsParams);

        getData(queryURL, newsFn);
        /////// END NEWS API ///////

        ///////// Firebase ///////// 
        event.preventDefault();
        var cityName = $("#search-city").val().trim();
        //var userAge = $("#user-age").val().trim();
    
        // Creates local "temporary" object
        var newCity = {
        city: cityName,
        //age: userAge
        };
    
        // Uploads data to the database
        database.ref().push(newCity);
    
        // Logs everything to console
        //console.log(newCity.city);
        //console.log(newCity.age);
    
        // Clears all of the text-boxes
        $("#search-city").val("");
        //$("#user-age").val("");

    });
    // Add to Firebase
    database.ref().on("child_added", function(snapshot) {
        //console.log(snapshot.val());
        // Store everything into a variable.
        var searchCity = snapshot.val().city;
        //var searchAge = snapshot.val().age;
    
    });

});