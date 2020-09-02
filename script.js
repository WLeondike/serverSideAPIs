//GLOBALS
let city = $(".city");
let wind = $(".wind");
let humidity = $(".humidity");
let temp = $(".temp");

//users searches are stored in this array
let searchHistory = [];

$(document).ready(function () {
  usersSearches();

  //click event for search
  $("#userSearch").click(function (event) {
    event.preventDefault();
    let usrSearch = $("#search").val().trim();
    searchInput(usrSearch);
  });

  function searchInput(cityName) {
    //city search URL
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=596ff6a8b9059e68a3a5b2f8821c0145`;

    //add search term to top of list of lastCity
    $("<button>").text(cityName).prepend(".list-group-item");
    //ajax call for local weather
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      let lastCityInput = JSON.parse(localStorage.getItem("lastCity"));
      if (lastCityInput) {
        lastCityInput.push(response.name);
        localStorage.setItem("lastCity", JSON.stringify(lastCityInput));
      } else {
        searchHistory.push(response.name);
        localStorage.setItem("lastCity", JSON.stringify(searchHistory));
      }
      //Log the data in HTML
      let inputCity = $(".jumbotron").addClass("cityInfo").text(cityName);
      let todaysDate = moment().format("MM/DD/YYYY");
      const indexIcon = response.weather[0].icon;
      const iconurl = `https://openweathermap.org/img/w/${indexIcon}.png`;

      //temp converted from celcius to fahrenheit + text display
      let weatherImg = $("<img>").attr("src", iconurl);
      let tempF = (response.main.temp - 273.15) * 1.8 + 32;
      let tempUp = Math.floor(tempF);
      let cityFahrenheit = $("<p>")
        .text("Temperature: " + tempUp + "°F")
        .addClass("lead");

      //rest of the data needed for the page
      let humidityData = $("<p>")
        .text("Humidity: " + response.main.humidity + "%")
        .addClass("lead");
      let windData = $("<p>")
        .text("Wind Speed: " + response.wind.speed + " MPH")
        .addClass("lead");

      //append the elements together
      inputCity.append(
        " ",
        todaysDate,
        weatherImg,
        cityFahrenheit,
        humidityData,
        windData
      );
      $("container").append(inputCity);

      //UV index with badges
      let lat = response.coord.lat;
      let lon = response.coord.lon;
      const queryUVURL = `https://api.openweathermap.org/data/2.5/uvi?appid=596ff6a8b9059e68a3a5b2f8821c0145&lat=${lat}&lon=${lon}`;
      $.ajax({
        url: queryUVURL,
        method: "GET",
      }).then(function (responseUV) {
        let currentUV = $("<div>").addClass("lead UVIndex").text("UV Index: ");
        let uvValue = $("<span class='badge id='current-UVLevel'>").text(
          responseUV.value
        );
        currentUV.append(uvValue);
        if (responseUV.value >= 0 && responseUV.value < 3) {
          $(uvValue).addClass("badge-success");
        } else if (responseUV.value >= 3 && responseUV.value < 6) {
          $(uvValue).addClass("badge-mild");
        } else if (responseUV.value >= 6 && responseUV.value < 8) {
          $(uvValue).addClass("badge-warning");
        } else if (responseUV.value >= 8 && responseUV.value < 11) {
          $(uvValue).addClass("badge-veryhigh");
        } else if (responseUV.value >= 11) {
          $(uvValue).addClass("badge-danger");
        }
        inputCity.append(currentUV);
        usersSearches();
      });

      //five day forecast cards
      const queryFiveURL = `https://api.openweathermap.org/data/2.5/forecast?q=${lat}&lon=${lon}&units=imperial&appid=596ff6a8b9059e68a3a5b2f8821c0145`;

      for (let i = 1; i < 6; i++) {
        $.ajax({
          url: queryFiveURL,
          method: "GET",
        }).then(function (fiveDayResponse) {
          let cardbodyElem = $("<div>").addClass("card-body");
          let fiveDayCard = $("<div>").addClass(".cardbody");
          let fiveDate = $("<h5>").text(
            moment.unix(fiveDayResponse.daily[i].dt).format("MM/DD/YYYY")
          );
          fiveDayCard.addClass("headline");

          let fiveDayTemp = $("<p>").text(
            "Temp: " + fiveDayResponse.daily[i].temp.max + "°F"
          );
          fiveDayTemp.attr("id", "#fiveDayTemp[i]");

          let fiveHumidity = $("<p>")
            .attr("id", "humDay")
            .text(
              "Humidity: " +
                JSON.stringify(fiveDayResponse.daily[i].humidity) +
                "%"
            );
          fiveHumidity.attr("id", "#fiveHumidity[i]");

          let indexIcon = fiveDayResponse.daily[i].weather[0].icon;
          let iconURL = `https://openweathermap.org/img/w/${indexIcon}.png`;
          let weatherImgDay = $("<img>").attr("src", iconURL);
          $("#testImage").attr("src", iconURL);

          //cards for the five day
          cardbodyElem.append(fiveDate);
          cardbodyElem.append(weatherImgDay);
          cardbodyElem.append(fiveDayTemp);
          cardbodyElem.append(fiveHumidity);
          fiveDayCard.append(cardbodyElem);
          $("#five-day").append(fiveDayCard);
          $("#fiveDayTemp[i]").empty();
          $(".jumbotron").append(cardbodyElem);
        });
      }
      $("#search").val("");
    });
  }

  ///local storage click function
  $(document).on("click", ".city-btn", function () {
    event.preventDefault();
    JSON.parse(localStorage.getItem("lastCity"));
    let cityName = $(this).text();
    searchInput(cityName);
  });

  //function to store last searches
  function usersSearches() {
    let searchList = JSON.parse(localStorage.getItem("lastCity"));
    $("#search-list").empty();
    if (searchList) {
      for (i = 0; i < searchList.length; i++) {
        let listBtn = $("<button>")
          .addClass("btn btn-secondary city-btn")
          .attr("id", "inputCity_" + (i + 1))
          .text(searchList[i]);
        let listElem = $("<li>").attr("class", "list-group-item");
        listElem.append(listBtn);
        $("#search-list").append(listElem);
      }
    }
  }
});
