$(document).ready(function(){
// MeetUp API
 var meetUpURL = "";


// NY TIMES queryURL for API
 var newsURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

var newsData = function(url) {
    $.ajax({
        url: url,
        method: "GET"
    }).then(function(newsResponse) {
        console.log(newsResponse)
    });
}

$("#search-btn").on("click", function(event){
    event.preventDefault();

    var location = $('#search-city').val().trim();

    ////// NEWS API ///////
    var newsParams = { 
     "api-key": 
     "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M" 
    };
    
    newsParams.q = location;

    var queryURL = newsURL + $.param(newsParams);

    newsData(queryURL);
    /////// END NEWS API ///////

});





});
