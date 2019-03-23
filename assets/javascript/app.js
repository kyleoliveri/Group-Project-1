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

    $("#weather").hide();
    $("#news").hide();
    $("#event").hide();
    $("#navbar").hide();

    // Stylized search button
    $('.search-button').click(function(){
        $(this).parent().toggleClass('open');
    });

    // NY TIMES queryURL for API
    var newsURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

    var weatherFn = function (data) {
        var displayWeather = $('<h3>');
        var weather = Math.round(data.list[0].main.temp);
        var location = data.city.name;
        var p = $('<p>');
        var p2 = $('<p>');
        p.text(weather  + '\xB0F');
        p2.text('Current Temp in ' + location);
        displayWeather.append(p2);
        displayWeather.append(p);
        $('#weather').append(displayWeather);
        console.log(data);
    };
  
    var ticketFn = function (data) {

        console.log("Ticketmaster: ", data);
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

    };

    var newsFn = function (data) {
        console.log("News: ", data);

        var outerUl = $("<ul>");
        var articles = data.response.docs;

        for (var i = 0; i < articles.length; i++) {
            var mainLi = $("<li>");
            mainLi.text(articles[i].headline.main);

            var innerOl = $("<ul>");
            var subLi = $("<li>");
            subLi.text(articles[i].snippet);
            subLi.append("<a href='" + articles[i].web_url + "'>" + articles[i].web_url + "</a>");

            innerOl.append(subLi);
            outerUl.append(innerOl);
        }

        $("#news").append(outerUl);

    };

    var getData = function (url, callback) {
        $.ajax({
            url: url,
            method: "GET"
        }).then(function (response) {
            callback(response);
        });
    };

    $("#search-btn").on("click", function(event) {
        event.preventDefault();
        if($('#search-city').val()) {
        var location = $('#search-city').val().trim();

        $('#firstSearch').hide();

        var ticketURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + location + "&apikey=GUGxZfyhbML7wYGWnG6WJgswr520dPab";
        var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=ee154728981041b7ff67246fa7ea0282&q=" + location + "&units=imperial";

        getData(ticketURL, ticketFn);
        getData(weatherURL, weatherFn);

        ////// NEWS API ///////
        var newsParams = {
            "api-key":
                "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M"
        };

        newsParams.q = location;

        var queryURL = newsURL + $.param(newsParams);

        getData(queryURL, newsFn);
        /////// END NEWS API ///////
        
        $("#weather").show();
        $("#news").show();
        $("#event").show();
        $("#navbar").show();
        }

        ///////// Firebase ///////// 
        event.preventDefault();
        var cityName = $("#search-city").val();
    
        // Creates local "temporary" object
        var newCity = {
        city: cityName,
        };
    
        // Uploads data to the database
        database.ref().push(newCity);
    
        // Clears all of the text-boxes
        $("#search-city").val("");

    });

    // Add to Firebase
    database.ref().on("child_added", function(snapshot) {
        // Store everything into a variable.
        var searchCity = snapshot.val().city;
    
    });

});

