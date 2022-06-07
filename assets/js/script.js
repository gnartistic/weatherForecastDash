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
    currentWeatherDataApi(searchInputEl.val()) // the search input value
}

// fetch request for current weather api
function currentWeatherDataApi(cityName) { // 
    var url = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${cityName}&appid=${weatherAppId}`; // api url, parameter expressions: cityName & weatherAppId (AJAX? whoop whoop), imperial units for fahrenheit
    fetch(url) // fetch the url
        .then(response => response.json()) // convert response to json
        .then(data => {
            cityName = data.name; // makes cityName whatever the name of the city you searched for is
            console.log(data.name); // gotta make sure this bad boy is working
            oneCallApi(cityName, data.coord.lon, data.coord.lat); // pulls latitude and longitude coordinates of city searched
            dispSearchHist(cityName, false); 
        })
        .catch(error => {
            console.log("Error:", error); // console log error if any
        });
    
    return;
}

// fetch data for one call api
function oneCallApi(cityName, longitude, latitude) {
    var url = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lon=${longitude}&lat=${latitude}&appid=${weatherAppId}`; // one call api url with lon and lat expressions as paramters, imperial for fahrenheit 
    fetch(url)
        .then(response => response.json()) // convert to json
        .then(data => {
            dispCurrentWeather(cityName, data.current); // currentWeather
            weeklyForecast(data.daily) // forecastData
        });
}

function dispCurrentWeather(cityName, currentWeather) {
    // current conditions => city name, date, icon of weather conditions, temp, humidity, wind speed, uv index
    $("#currentWeatherName").html(cityName); //city name
    $("#currentWeatherDate").html(moment().format("M/DD/YYYY")) //date
    $("#currentWeatherIcon").attr("src", `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`); //icon of weather conditions, source = https://openweathermap.org/weather-conditions
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

function weeklyForecast(forecastData) {
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
        </div>`) // template string containing elements containing dynamic forecast data
        divEl.appendTo(forecastContainer)
    }
}

function dispSearchHist(cityName, initialStart) {
    // search history => when click presented with current and future conditions for that city
    var matchFound = false;
    $("#previousSearches").children("").each(function (i) {
        if (cityName == $(this).text()) {
            matchFound = true;
            return;
        }
    });
    if (matchFound) { return; }

    var buttonEl = $(`<button type="button" class="col-12 mt-3 btn btn-secondary">${cityName}</button>`)
    buttonEl.on("click", previousButtonClick);
    buttonEl.prependTo(searchHistoryEl);

    if (!initialStart) { savePreviousData(cityName) };
}

function savePreviousData(cityName) {
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