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
    $('.search-button').click(function () {
        $(this).parent().toggleClass('open');
    });

    // NY TIMES queryURL for API
    var newsURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

    //WEATHER FUNCTION
    var weatherFn = function (data) {
        console.log("Weather: ", data);
        console.log("hello");
        var ul = $('<ul>');
        var weather = data.list;
        for (var i = 0; i < 10; i++) {
            var li = $('<li>');
            li.text(weather[i].main.temp);
            // Must turn into F
            ul.append(li);
        }
        $('#weather').append(ul);
        console.log(weather);
    };

    //TICKETMASTER FUNCTION
    var ticketFn = function (data) {

        console.log("Ticketmaster: ", data);
        console.log(data._embedded);
        var ul = $('<ul>');
        var events = data._embedded.events;

        for (var i = 0; i < 10; i++) {
            var li = $('<li>');
            li.text(events[i].name);
            ul.append(li);
        }
        $('#event').append(ul);
        console.log(events);

    };

    //NEWS FUNCTION
    var newsFn = function (data) {
        console.log("News: ", data);
        var articles = data.response.docs;
        var articleList = $("<ul>");
        for (var i = 0; i < 10; i++) {

            articleList.addClass("list-group");

            var articleListItem = $("<span class='articleHeadline text-left'>");

            articleListItem.append("<strong>" + articles[i].headline.main + "</strong>");

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

        var location = $('#search-city').val().trim();

        var ticketURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + location + "&apikey=GUGxZfyhbML7wYGWnG6WJgswr520dPab";
        var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=ee154728981041b7ff67246fa7ea0282&q=" + location;

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