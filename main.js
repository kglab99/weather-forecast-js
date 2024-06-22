let geolocation;
let forecast;
let today;
let map;
let city;
let latitude;
let longitude;

getLocation();

if (window.innerWidth < 900) {
    getLocation();
}

function getLocation() {
        navigator.geolocation.getCurrentPosition(setPosition,error);
}

function hidePrompt() {
    document.querySelector("div.prompt").style.display = "none";
}

function error(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        hidePrompt();
        document.querySelector("div#locate-btn").style.display = "none";
        locateWithIP();
      break;
      case error.POSITION_UNAVAILABLE:
        hidePrompt();
        locateWithIP();
      break;
      case error.TIMEOUT:
        hidePrompt();
        locateWithIP();
      break;
      case error.UNKNOWN_ERROR:
        hidePrompt();
        locateWithIP();
      break;
    }
  }


function setPosition(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        hidePrompt();
        getWithGeolocation();
}

document.querySelector("button.no-geolocation").addEventListener("click", () => {
    locateWithIP();
    hidePrompt();
});

function locateWithIP() {
      getForecastIP()
        .then(function(result) {
          forecast = result;
          today = getWeekday(forecast.location.localtime.split(' ')[0]);
          fillDom();
          loadingAnimationOff();
          
        })
}

document.querySelector("button.locate-btn").addEventListener("click", locate);

function locate(){
    loadingAnimationOn();
    
    navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        getWithGeolocation();
      });

}

// Search input

// Keyboard support
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchLocation();

    }
})

function searchLocation() {
    city = document.querySelector("input.search").value;

    if (city != "") {
        loadingAnimationOn();
        getOnSearch();
        document.querySelector("input.search").value = "";
    } else {
        document.querySelector("input.search").placeholder = "Type to search";
    }

 
}

// Main functions to fetch data and populate DOM, global vars


// Lat and long set default as not assigning them caused errors when location permission was denied on load

// For window load




// For button click
function getWithGeolocation (){
    city = getCity()
      .then(function(result){
        geolocation = result;
        city = normalizeString(geolocation.address.city);
        getForecast()
          .then(function(result) {
            forecast = result;
            today = getWeekday(forecast.location.localtime.split(' ')[0]);
            fillDom();
            loadingAnimationOff();
              
          })
      });
}

// For search input
function getOnSearch () {
    getForecast()
            .then(function(result) {
                if (result != "error") {
                    forecast = result;
                    today = getWeekday(forecast.location.localtime.split(' ')[0]);
                    longitude =  forecast.location.lon;
                    latitude = forecast.location.lat;
                    fillDom();
                    loadingAnimationOff();
                } else {
                    displayError();
                }

                    
        })
}

// Async functions

// Get user city based on coordinates from geolocation
async function getCity() {
    try {
        const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=pk.9fdc1490ae4d809ce9ece84b2c3bda46&lat=${latitude}&lon=${longitude}&format=json&accept-language=en&`, {mode: 'cors'});
        const city = await response.json();
        return city;
    } catch (e) {
    }
}

// Get forecast and astronomy forecast based on city name
async function getForecast() {
    try {

        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b97a7289e4e24edbbb8101327242006&q=${city}&days=8`, {mode: 'cors'});
        if (response.ok == true) {
            const forecast = await response.json();
            return forecast;
        } else {
            displayError();
        }

    } catch (e) {
        return "error";
    }
}

function displayError() {
    const body = document.querySelector("body");
    const errorMessage = document.createElement("h1");
    errorMessage.textContent = "Error. Please reload page.";
    body.insertAdjacentElement("afterbegin",errorMessage);
}

//// Get forecast and astronomy forecast based on IP adress
async function getForecastIP() {
    try {

        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b97a7289e4e24edbbb8101327242006&q=auto:ip&days=8`, {mode: 'cors'});
        const forecast = await response.json();
        return forecast;
    } catch (e) {
    }
}


// Additional functions

// Normalize special characters to one used by weather API
function normalizeString(str) {
    const iMap = {
        'ð': 'd',
        'ı': 'i',
        'Ł': 'L',
        'ł': 'l',
        'ø': 'o',
        'ß': 'ss',
        'ü': 'ue'
    };
    const iRegex = new RegExp(Object.keys(iMap).join('|'), 'g')
    return str
        .replace(iRegex, (m) => iMap[m])
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '');
    }

// Convert date to weekday
function getWeekday(date){
    const date0 = new Date(date);
    day = date0.getDay();
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return weekday[day];
}

// Loading animation on/off
function loadingAnimationOn() {
    document.querySelector("div.container").style.display = "flex";
    document.querySelector("div#weather").style.display = "none";
    document.querySelector("div#search").style.display = "none";
}

function loadingAnimationOff() {
    document.querySelector("div.container").style.display = "none";
    document.querySelector("div#weather").style.display = "flex";
    document.querySelector("div#search").style.display = "flex";
}

// DOM updaters

function fillDom(){

    document.querySelector("p.current-text").textContent = forecast.current.condition.text;
    document.querySelector("h1.current-temp").textContent = `${forecast.current.temp_c}°C`;

    document.querySelector("p.location").textContent = `${forecast.location.name}, ${forecast.location.country}`;
    document.querySelector("p.date").textContent = `${today}, ${forecast.location.localtime.split(' ')[0].split('-')[2]}.${forecast.location.localtime.split(' ')[0].split('-')[1]}.${forecast.location.localtime.split(' ')[0].split('-')[0]}`;

    document.querySelector("p.wind").textContent = `${forecast.current.wind_kph}km/h`;

    document.querySelector("p.rain").textContent = `${forecast.forecast.forecastday[0].day.daily_chance_of_rain}`;
    document.querySelector("p.pressure").textContent = `${forecast.forecast.forecastday[0].day.daily_chance_of_rain}%`;

    document.querySelector("p.temp-0").textContent = `${forecast.forecast.forecastday[0].hour[0].temp_c}°C`;
    document.querySelector("img.img-0").src = forecast.forecast.forecastday[0].hour[0].condition.icon;

    document.querySelector("p.temp-6").textContent = `${forecast.forecast.forecastday[0].hour[6].temp_c}°C`;
    document.querySelector("img.img-6").src = forecast.forecast.forecastday[0].hour[6].condition.icon;

    document.querySelector("p.temp-12").textContent = `${forecast.forecast.forecastday[0].hour[12].temp_c}°C`;
    document.querySelector("img.img-12").src = forecast.forecast.forecastday[0].hour[12].condition.icon;

    document.querySelector("p.temp-18").textContent = `${forecast.forecast.forecastday[0].hour[18].temp_c}°C`;
    document.querySelector("img.img-18").src = forecast.forecast.forecastday[0].hour[18].condition.icon;

    document.querySelector("p.day1-text").textContent = `${forecast.forecast.forecastday[1].day.condition.text}`;
    document.querySelector("h1.day1-temp").textContent = `${forecast.forecast.forecastday[1].day.avgtemp_c}°C`;
    document.querySelector("img.day1").src = forecast.forecast.forecastday[1].day.condition.icon;

    document.querySelector("p.day2").textContent = getWeekday(forecast.forecast.forecastday[2].date);
    document.querySelector("p.day2-text").textContent = `${forecast.forecast.forecastday[2].day.condition.text}`;
    document.querySelector("h1.day2-temp").textContent = `${forecast.forecast.forecastday[2].day.avgtemp_c}°C`;
    document.querySelector("img.day2").src = forecast.forecast.forecastday[2].day.condition.icon;

    document.querySelector("p.day3").textContent = getWeekday(forecast.forecast.forecastday[3].date);
    document.querySelector("p.day3-text").textContent = `${forecast.forecast.forecastday[3].day.condition.text}`;
    document.querySelector("h1.day3-temp").textContent = `${forecast.forecast.forecastday[3].day.avgtemp_c}°C`;
    document.querySelector("img.day3").src = forecast.forecast.forecastday[3].day.condition.icon;


}


