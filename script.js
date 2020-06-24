//Globals
const city = $(".city");
const wind = $(".wind");
const temp = $(".temp");
const humidity = $(".humidity");

//users searches are stored here
const searchHistory = [];           

$(document).ready(function(){

    usersSearches();

    $("#userSearch").click(function (event){
        event.preventDefault();
        let usrSearch = $("#usrInput").val().trim;
        searchInput(usrSearch);
    });

    function searchInput(cityName);

    const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=596ff6a8b9059e68a3a5b2f8821c0145";
    $("<button>").text(cityName).prepend(".list-group-item");

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        let lastCityInput = JSON.parse(localStorage.getItem("cities"));
        if (lastCityInput) {
            lastCityInput.push(response.name)
            localStorage.setItem("cities", JSON.stringify(lastCityInput));
        }else {
            searchHistory.push(response.name);
            localStorage.setItem("cities", JSON.stringify(searchHistory));
        }

        // Log the data in HTML
        

        //celcius to fahrenheit
        const tempF = (response.main.temp - 273.15) * 1.80 + 32;
            
        }
    });

});


