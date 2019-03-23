$(document).ready(function () {

    console.log("If you come this far... It's too late");

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
    $('.search-button').click(function () {
        $(this).parent().toggleClass('open');
    });

    // NY TIMES queryURL for API
    var newsURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

    //WEATHER FUNCTION
    var weatherFn = function (data) {

        var displayWeather = $('<h3>');
        var weather = Math.round(data.list[0].main.temp);
        var location = data.city.name;
        var p = $('<p>');
        var p2 = $('<p>');
        p.text(weather + '\xB0F');
        p2.text('Current Temp in ' + location);
        displayWeather.append(p2);
        displayWeather.append(p);
        $('#weather').append(displayWeather);
        $("#cityNameNav").append("<h3>" + data.city.name + ", " + data.city.country + "</h3>");
        console.log(data);

    };

    //TICKETMASTER FUNCTION
    var ticketFn = function (data) {
        console.log("Ticketmaster: ", data);
        var events = data._embedded.events;
        var eventsList = $('<ul>');

        for (var i = 0; i < 10; i++) {
            eventsList.addClass("list-group");

            var eventsListItem = $("<span class='eventsName text-left border'>");
            eventsListItem.append("<strong>" + events[i].name + "</strong>");

            var li = $("<span>");
            eventsListItem.append(li);

            var url = $("<span>");
            url.append("<br> <a href='" + events[i].url + "'>" + events[i].url + "</a>");

            eventsListItem.append(url);
            eventsList.append(eventsListItem);     
        };

        $('#event').append(eventsList);
    };


    //NEWS FUNCTION
    var newsFn = function (data) {
        console.log("News: ", data);
        var articles = data.response.docs;
        var articleList = $("<ul>");
        for (var i = 0; i < 10; i++) {

            articleList.addClass("list-group");

            var articleListItem = $("<span class='articleHeadline text-left border'>");

            articleListItem.append("<h5>" + articles[i].headline.main + "</h5>");

            var li = $("<span> <br>");
            li.append(articles[i].snippet);
            articleListItem.append(li);

            var url = $("<span>");
            url.append("<br> <a href='" + articles[i].web_url + "'>" + articles[i].web_url + "</a>");
            articleListItem.append(url);

            articleList.append(articleListItem);

        }

        $("#news").append(articleList);

    };

    var getData = function (url, callback) {
        $.ajax({
            url: url,
            method: "GET"
        }).then(function (response) {
            callback(response);
        });
    };


    //ON CLICK FUNCTION
    $("#search-btn").on("click", function (event) {

        event.preventDefault();
        if ($('#search-city').val()) {
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

        var cityName = $("#search-city").val().trim();

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
    database.ref().on("child_added", function (snapshot) {
        // Store everything into a variable.
        var searchCity = snapshot.val().city;

    });

});

