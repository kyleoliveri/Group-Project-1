$(document).ready(function () {
  
// NY TIMES queryURL for API
 var newsURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
  
    var getData = function (url) {
        $.ajax({
            url: url,
            method: "GET"
        }).then(function (response) {
            console.log(response);
        });
    };

    $("#search-btn").on("click", function (event) {
        event.preventDefault();

        var location = $('#search-city').val().trim();
        var ticketURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + location + "&apikey=GUGxZfyhbML7wYGWnG6WJgswr520dPab";
        var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=ee154728981041b7ff67246fa7ea0282&q=" + location;

        getData(ticketURL);
        getData(weatherURL);
      
       ////// NEWS API ///////
    var newsParams = { 
     "api-key": 
     "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M" 
    };
    
    newsParams.q = location;

    var queryURL = newsURL + $.param(newsParams);

    getData(queryURL);
    /////// END NEWS API ///////
      

    });



});
