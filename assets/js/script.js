const apiKey = "5749746aca0548a2ddb4d0453f8c2fee";
var currWeatherDiv = $("#todaysWeather");
var forecastDiv = $("#weatherForecast");
var cityArray;

if (localStorage.getItem("localWeatherSearches")) {
  cityArray = JSON.parse(localStorage.getItem("localWeatherSearches"));
  writeSearchHistory(cityArray);
} else {
  cityArray = [];
}

function returnCurrentWeather(cityName) {
  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${apiKey}`;

  $.get(queryURL).then(function (response) {
    let currTime = new Date(response.dt * 1000);
    let weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;

    currWeatherDiv.html(
      `
        <h2>${response.name}, ${response.sys.country} (${
        currTime.getMonth() + 1
      }/${currTime.getDate()}/${currTime.getFullYear()})<img src=${weatherIcon} height="70px"></h2>
        <p>Temperature: ${response.main.temp} &#176;C</p>
        <p>Humidity: ${response.main.humidity}%</p>
        <p>Wind Speed: ${response.wind.speed} m/s</p>
        `,
      returnUVIndex(response.coord)
    );
    createHistoryButton(response.name);
  });
}
function returnWeatherForecast(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=${apiKey}`;

    $.get(queryURL).then(function(response){
        let forecastInfo = response.list;
        forecastDiv.empty();
        $.each(forecastInfo, function(i) {
            if (!forecastInfo[i].dt_txt.includes("12:00:00")) {
                return;
            }
            let forecastDate = new Date(forecastInfo[i].dt*1000);
            let weatherIcon = `https://openweathermap.org/img/wn/${forecastInfo[i].weather[0].icon}.png`;

            forecastDiv.append(`
            <div class="col-md">
                <div class="card text-white bg-primary">
                    <div class="card-body">
                        <h4>${forecastDate.getMonth()+1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4>
                        <img src=${weatherIcon} alt="Icon">
                        <p>Temp: ${forecastInfo[i].main.temp} &#176;C</p>
                        <p>Humidity: ${forecastInfo[i].main.humidity}%</p>
                    </div>
                </div>
            </div>
            `)
        })
    })
};


function createHistoryButton(cityName) {
  var citySearch = cityName.trim();
  var buttonCheck = $(`#previousSearch > BUTTON[value='${citySearch}']`);
  if (buttonCheck.length == 1) {
    return;
  }

  if (!cityArray.includes(cityName)) {
    cityArray.push(cityName);
    localStorage.setItem("localWeatherSearches", JSON.stringify(cityArray));
  }

  $("#previousSearch").prepend(`
    <button class="btn btn-light cityHistoryBtn" value='${cityName}'>${cityName}</button>
    `);
}


  returntodaysWeather("Nashville");
  returnweatherForecast("Nashville");

$("#submitCity").click(function () {
  event.preventDefault();
  let cityName = $("#cityInput").val();
  returntodaysWeather(cityName);
  returnWeatherForecast(cityName);
});
