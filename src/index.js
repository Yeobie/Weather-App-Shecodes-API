let now = new Date();

let date = document.querySelector("#current-date");

let hours = now.getHours();
let minutes = now.getMinutes();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

if (hours < 10) {
  hours = `0${hours}`;
}
if (minutes < 10) {
  minutes = `0${minutes}`;
}

date.innerHTML = `${day} ${hours}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`; //goes outside the function that loops (which starts at line 54)
  //because otherwise the loop would involve also the row, and there would be 5 rows one under the other.
  //With this method, you get only one row and what is looped is what's INSIDE the row.
  //so the columns, which have a class of col-2 so when they get looped they end up one next to the other for 5 times.

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      let max = Math.round(forecastDay.temperature.maximum);
      let min = Math.round(forecastDay.temperature.minimum);
      forecastHTML =
        forecastHTML +
        `
        <div class="col-2 forecast-squares">
          <div class="forecast-day-week">
            ${formatDay(forecastDay.time)}
          </div>
          <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            forecastDay.condition.icon
          }.png" height="70"
          />
          <div class="forecast-temperatures">
            <span class="forecast-temp-max">${max}º</span>
            <span class="forecast-temp-min">${min}º</span>
          </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + ` </div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "f05bbfeo3a24e0d00t5941bd06aa34a4";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function getWeather(response) {
  celsiusTemperature = response.data.temperature.current;
  let temperature = Math.round(celsiusTemperature);
  let degrees = document.querySelector("#degrees-value");
  degrees.innerHTML = `${temperature}`;
  let celsius = document.querySelector("#celsius-degrees");
  celsius.innerHTML = "ºC";
  let fahrenheit = document.querySelector("#fahrenheit-degrees");
  fahrenheit.innerHTML = "ºF";
  let description = response.data.condition.description;
  let weather = document.querySelector("#weather-description");
  weather.innerHTML = `${description}`;
  windMetric = response.data.wind.speed;
  let wind = Math.round(windMetric);
  let windspeed = document.querySelector("#wind");
  windspeed.innerHTML = `Wind: ${wind} km/h`;
  let humidity = response.data.temperature.humidity;
  let humidityvalue = document.querySelector("#humidity");
  humidityvalue.innerHTML = `Humidity: ${humidity}%`;
  let weatherIcon = document.querySelector("#icon");
  weatherIcon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  weatherIcon.setAttribute("alt", response.data.condition.description);
  let forecastHeader = document.querySelector("h4");
  forecastHeader.innerHTML = `<strong>Forecast</strong>`;
  getForecast(response.data.coordinates);
}

function searchCity(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#search-city-input");
  let city = document.querySelector("#city-name");
  city.innerHTML = `${searchedCity.value}`;
  let apiKey = "f05bbfeo3a24e0d00t5941bd06aa34a4";

  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${searchedCity.value}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(getWeather);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchCity);
let search = document.querySelector("#search-button");
search.addEventListener("click", searchCity);

function getImperialForecast(coordinates) {
  let apiKey = "f05bbfeo3a24e0d00t5941bd06aa34a4";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function getWeatherImperial(response) {
  getImperialForecast(response.data.coordinates);
}

function searchCityImperial(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#search-city-input");
  let city = document.querySelector("#city-name");
  city.innerHTML = `${searchedCity.value}`;
  let apiKey = "f05bbfeo3a24e0d00t5941bd06aa34a4";

  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${searchedCity.value}&key=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(getWeatherImperial);
}

function convertFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperature = document.querySelector("#degrees-value");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemperature);
  let windspeed = document.querySelector("#wind");
  let windImperial = Math.round(windMetric * 0.621371);
  windspeed.innerHTML = `Wind: ${windImperial} mph`;
}

function convertCelsius(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

let celsiusTemperature = null;
let windMetric = null;
let fahrenheitLink = document.querySelector("#fahrenheit-degrees");
fahrenheitLink.addEventListener("click", convertFahrenheit);
fahrenheitLink.addEventListener("click", searchCityImperial);

let celsiusLink = document.querySelector("#celsius-degrees");
celsiusLink.addEventListener("click", convertCelsius);
celsiusLink.addEventListener("click", searchCity);
