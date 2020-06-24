//Globals
const city = $(".city");
const wind = $(".wind");
const temp = $(".temp");
const humidity = $(".humidity");

//users searches are stored here
const searchHistory = [];

$(document).ready(function () {

    usersSearches();

    $("#userSearch").click(function (event) {
        event.preventDefault();
        let usrSearch = $("#usrInput").val().trim;
        searchInput(usrSearch);
    });

    function searchInput(cityName) {

        //city search URL
        const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=596ff6a8b9059e68a3a5b2f8821c0145";
        $("<button>").text(cityName).prepend(".list-group-item");

        //ajax for city search
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let lastCityInput = JSON.parse(localStorage.getItem("lastCity"));
            if (lastCityInput) {
                lastCityInput.push(response.name)
                localStorage.setItem("lastCity", JSON.stringify(lastCityInput));
            } else {
                searchHistory.push(response.name);
                localStorage.setItem("lastCity", JSON.stringify(searchHistory));
            }

            // Log the data in HTML
            const inputCity = $(".jumbotron").addClass("cityInfo").text(cityName);
            const todaysDate = moment().format(" MMMM Do YYYY");
            const indexIcon = response.weather[0].icon;
            const indexImg = $("<img>").attr("src", "https://openweathermap.org/img/w/" + indexIcon + ".png");
            //celcius to fahrenheit
            const tempF = (response.main.temp - 273.15) * 1.80 + 32;
            const tempUp = Math.floor(tempF);
            const cityF = $("<p>").text("Temperature: " + tempUp + "°F").addClass("lead");
            const cityHumidity = $("<p>").text("Humidity: " + response.main.humidity + "%").addClass("lead");
            const cityWind = $("<p>").text("Wind Speed: " + response.wind.speed).addClass("lead");

            inputCity.append(todaysDate, indexImg, cityF, cityHumidity, cityWind);
            $("container").append(inputCity);



            $("#search").val("")
        })

    }

    $(document).on("click", ".cityBtn", function () {
        JSON.parse(localStorage.getItem("lastCity"));
        let cityName = $(this).text();
        searchInput(cityName);
    });

    function usersSearches() {
        const usrList = JSON.parse(localStorage.getItem("lastCity"));
        $("#searchHistory").empty();
        if (usrList) {
            for (let i = 0; i < usrList.length; i++) {
                const historyName = ("<p>").attr('class', 'list-group-item');
                $("#usrList").append(historyName);
            }
        }
    }


});


