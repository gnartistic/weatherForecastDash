// HTML Variables
var citySearchEl = $("#citySearchForm");
var searchInputEl = $("#searchInput");
var forecastContainer = $("#forecastContainer");
var searchHistoryEl = $("#previousSearches");

// global var
var weatherAppId = "f327d5702804884321d27bf19eaae2bb";

// search function
function searchInput(event) {
    event.preventDefault()
    currentWeatherDataApi(searchInputEl.val()) // the search input value aka cityName
}

// fetch request for current weather api
function currentWeatherDataApi(cityName) {
    fetch("https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + cityName + "&appid=" + weatherAppId) // fetch the url
        .then(function (response) {
            response.json()
                .then(function (data) {
                    cityName = data.name; // pulls name of city searched
                    console.log(data.name); // gotta make sure this bad boy works
                    oneCallApi(cityName, data.coord.lon, data.coord.lat); // pulls latitude and longitude coordinates of city searched
                    dispSearchHist(cityName, false);
                })
                .catch(err => {
                    console.log("Error:", error);
                })

        });

    return;
}

// fetch data for one call api
function oneCallApi(cityName, longitude, latitude) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?units=imperial&lon=" + longitude + "&lat=" + latitude + "&appid=" + weatherAppId)
        .then(function (response) {
            response.json()
                .then(function (data) {
                    console.log(data); // where I look to pull data for current weather and daily forecast
                    dispCurrentWeather(cityName, data.current); // currentWeather
                    weeklyForecast(data.daily) // forecastData
                });
        });

    return;
}

function dispCurrentWeather(cityName, currentWeather) { // ref line 22 and line 38
    // current conditions => city name, date, icon of weather conditions, temp, humidity, wind speed, uv index
    $("#currentWeatherName").html(cityName); //city name
    $("#currentWeatherDate").html(moment().format("M/DD/YYYY")) //date
    $("#currentWeatherIcon").attr("src", "http://openweathermap.org/img/wn/" + currentWeather.weather[0].icon + ".png"); //icon of weather conditions, source = https://openweathermap.org/weather-conditions
    $("#currentWeatherTemp").html(currentWeather.temp) //temp
    $("#currentWeatherHumidity").html(currentWeather.humidity) //humidity
    $("#currentWeatherWind").html(currentWeather.wind_speed) //windspeed
    $("#currentWeatherUV").html(currentWeather.uvi) //uv index

    // uv index => color indicating favorable, moderate, severe
    if (currentWeather.uvi > 6) {
        $("#currentWeatherUV").css("background", "#8e2b2b") // maroon color, severe
    } else if (currentWeather.uvi > 4) {
        $("#currentWeatherUV").css("background", "#a5aa20") // mustard color, moderate
    } else {
        $("#currentWeatherUV").css("background", "#40aa20") // green color (420 ayeee), favorable
    }

    $("#cityWeatherContainer").css("display", "block")
}

function weeklyForecast(forecastData) { // ref line 39
    // forecast cards. 5 days, date, icon of weather conditions, temp, wind speed, humidity
    forecastContainer.html("");
    for (var i = 1; i <= 5; i++) { // loop for the 5 cards
        var divEl = $(`
        <div class="forecastCard">
        <p style="font-weight: 800">${moment().clone().add(i, "days").format("M/DD/YYYY")}</p>
        <img src="http://openweathermap.org/img/wn/${forecastData[i].weather[0].icon}.png">
        <p>Temp: ${forecastData[i].temp.day}°F</p>
        <p>Wind: ${forecastData[i].wind_speed}MPH</p>
        <p>Humidity: ${forecastData[i].humidity}%</p>
        </div>`) // template string creating elements containing dynamic forecast data pulled from data.daily
        divEl.appendTo(forecastContainer) // add to div element already created in html with an id = forecastContainer
    }
}

function dispSearchHist(cityName, initialStart) { // ref line 22
    // search history => when click presented with current and future conditions for that city
    var matchFound = false;
    $("#previousSearches").children("").each(function () { // 
        if (cityName == $(this).text()) {
            matchFound = true;
            return;
        }
    });
    if (matchFound) { return; }

    var buttonEl = $('<button type="button" class="col-12 mt-3 btn btn-secondary">' + cityName + '</button>')
    buttonEl.on("click", previousButtonClick);
    buttonEl.prependTo(searchHistoryEl);

    if (!initialStart) { savePreviousData(cityName) };
}

function savePreviousData(cityName) { // ref line 100
    tempItem = JSON.parse(localStorage.getItem("previousSearches"))
    if (tempItem != null) {
        localStorage.setItem("previousSearches", JSON.stringify(tempItem.concat(cityName)))
    } else {
        tempArr = [cityName];
        localStorage.setItem("previousSearches", JSON.stringify(tempArr))
    }
}

function previousButtonClick(event) {
    currentWeatherDataApi(event.target.innerHTML)
}

function start() { //declare events and load previous searches
    citySearchEl.submit(searchInput)
    tempArr = JSON.parse(localStorage.getItem("previousSearches"))
    if (tempArr != null) {
        for (let i = 0; i < tempArr.length; i++) {
            dispSearchHist(tempArr[i], true)
        }
    }
}

start()