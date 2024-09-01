const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
};

const searchInput = document.querySelector('.search-input');
const loading = document.querySelector('.loading');
const weatherInfo = document.querySelector('.weather-info');
const errorMessage = document.querySelector('.error-message');

searchInput.addEventListener('keypress', event => {
  if (event.keyCode === 13) {
    fetchWeatherData(searchInput.value);
  }
});

function fetchWeatherData(query) {
  loading.style.display = 'block';
  weatherInfo.style.display = 'none';
  errorMessage.innerText = '';

  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(updateWeatherInfo)
    .catch(error => {
      loading.style.display = 'none';
      errorMessage.innerText = error.message;
    });
}

function updateWeatherInfo(weather) {
  const cityName = document.querySelector('.city-name');
  cityName.innerText = `${weather.name}, ${weather.sys.country}`;

  const now = new Date();
  const currentDate = document.querySelector('.current-date');
  currentDate.innerText = formatDate(now);

  const currentTime = document.querySelector('.current-time');
  const timezoneOffset = weather.timezone / 3600; // Convert seconds to hours
  currentTime.innerText = formatTime(now, timezoneOffset);

  const temperature = document.querySelector('.temperature');
  temperature.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

  const weatherCondition = document.querySelector('.weather-condition');
  weatherCondition.innerText = weather.weather[0].main;

  const highLowTemp = document.querySelector('.high-low-temp');
  highLowTemp.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;

  const weatherIcon = document.getElementById('weather-icon');
  updateWeatherIcon(weatherIcon, weather.weather[0].main);

  loading.style.display = 'none';
  weatherInfo.style.display = 'block';
}

function updateWeatherIcon(element, condition) {
  element.className = 'weather-icon'; // Reset classes
  const iconMap = {
    Clear: '☀️ sunny',
    Clouds: '☁️ cloudy',
    Rain: '🌧️ rainy',
    Snow: '❄️ snowy',
    Thunderstorm: '⛈️ thunderstorm',
    Drizzle: '🌦️ drizzle',
    Mist: '🌫️ mist',
    Haze: '🌫️ mist',
    Fog: '🌫️ mist'
  };
  element.innerHTML = iconMap[condition].split(' ')[0];
  element.classList.add(iconMap[condition].split(' ')[1]);
}

function formatDate(date) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const day = days[date.getDay()];
  const dateNum = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${dateNum} ${month} ${year}`;
}

function formatTime(date, timezoneOffset) {
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
  const cityTime = new Date(utcTime + (3600000 * timezoneOffset));
  
  let hours = cityTime.getHours();
  let minutes = cityTime.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  return `${hours}:${minutes} ${ampm}`;
}
