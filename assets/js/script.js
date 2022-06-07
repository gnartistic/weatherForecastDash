// HTML Variables
var citySearchEl = $('#citySearchForm');
var searchInputEl = $('#searchInput');
var forecastContainer = $('#foreCastContainer');
var searchHistoryEl = $('#previousSearches');

// global var
var WeatherAppId = "f327d5702804884321d27bf19eaae2bb";

// search function
function searchInput(event) {
    event.preventDefault()
    CurrentWeatherDataApi(searchInputEl.val())
}

function CurrentWeatherDataApi(cityName) {
    var url = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${cityName}&appid=${WeatherAppId}";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            cityName.data.name;
            oneCallApi(cityName, data.coord.lon, data.coord.lat);
            searchHistory(cityName, fale);
        })
        .catch(error => {
            console.log("Error:", error);
        });
    
    return;
}

function oneCallApi(cityName, longitude, latitude) {
    var url = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lon=${longitude}&lat=${latitude}&appid=${openWeatherAppId}";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            CurrentWeather(cityName, data.current);
            WeeklyForecast(data.daily)
        });
}
