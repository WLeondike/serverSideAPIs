var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Orlando,Florida&appid=596ff6a8b9059e68a3a5b2f8821c0145";

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

    var tempF = (response.main.temp - 273.15) * 1.80 + 32;

});
