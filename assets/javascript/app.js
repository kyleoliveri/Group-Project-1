$(document).ready(function () {

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

    });

});
