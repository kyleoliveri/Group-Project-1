$(document).ready(function () {

    // NY TIMES queryURL for API
    var newsURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

    var weatherFn = function (data) {
        console.log("Weather: ", data);
    };
    var ticketFn = function (data) {
        console.log("Ticketmaster: ", data);
    };
    var newsFn = function (data) {
        console.log("News: ", data);

            var outerUl = $("<ul>");

                var articles = data.response.docs;

                    for (var i = 0; i < articles.length; i++) {
                        var mainLi = $("<li>"); 
                        mainLi.text(articles[i].headline.main);
                        
                            var innerOl = $("<ol>");
                            var subLi = $("<li>");
                            subLi.text(articles[i].snippet);
                            subLi.append("<a href='" + articles[i].web_url + "'>" + articles[i].web_url + "</a>");
                        
                        innerOl.append(subLi);

                        outerUl.append(mainLi);
                    }

            $("#news").append(outerUl);
        
     };
    var yelpFn = function (data) {
        console.log(data);
    };

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

    });

    

});
