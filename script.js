//Globals
const city = $(".city");
const wind = $(".wind");
const temp = $(".temp");
const humidity = $(".humidity");
const searchHistory = [];           //users searches are stored here

$(document).ready(function(){

const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=596ff6a8b9059e68a3a5b2f8821c0145";


$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log(queryURL);
    console.log(response);

    // Log the data in HTML
    $(".city").html("<h1>" + response.name + " Weather Details</h1>");
    $(".wind").text("Wind Speed " + response.wind.speed);
    $(".humidity").text("humidity: " + response.main.humidity);

    //celcius to fahrenheit
    const tempF = (response.main.temp - 273.15) * 1.80 + 32;

});

});