const weather_button_search = document.getElementById("weather_button_search");
const weather_button_close = document.getElementById("weather_button_close");
const form = document.getElementById("form");
const form_search_text = document.getElementById("form_search_text");
const weather_container = document.querySelector(".weather-container");
const errorContainer = document.getElementById("error-container");

function toggleFormVisibility() {
  form.classList.toggle("hidden");
  weather_button_search.classList.toggle("hidden");
  weather_button_close.classList.toggle("hidden");
}
weather_button_search.addEventListener("click", toggleFormVisibility);
weather_button_close.addEventListener("click", toggleFormVisibility);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = form_search_text.value;
  handleInput(text);
});

const apiK="3856d45062c6b9bea1c995ae3982e9f3"
function handleInput(text) {
  const url = `https://api.openweathermap.org/data/2.5/weather?&lang=es&units=metric&appid=${apiK}&q=${text}`;
  getData(url);
  form_search_text.value = "";
  toggleFormVisibility();
}

function getGeo() {
  const currentPosition = navigator.geolocation;

  if (currentPosition) {
    currentPosition.getCurrentPosition(
      (position) => {
        let latitude, longitude;
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?&lang=es&units=metric&lat=${latitude}&lon=${longitude}&appid=${apiK}`;
        getData(url);
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      }
    );
  } else {
    console.log("Geolocation not supported in this browser.");
  }
}

getGeo();

async function getData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

    const dataCity = {
      city: data.name,
      image: iconUrl,
      weather_description: data.weather[0].description,
      humidity: data.main.humidity,
      speed: data.wind.speed,
      temp: data.main.temp,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      feels_like: data.main.feels_like,
    };
    drawData(dataCity);
  } catch (error) {
    weather_container.style.opacity = 0.5;
    errorContainer.style.display = "block";
    errorContainer.innerText =
      "No se encontro ninguna ciudad con ese nombre. Intenta de nuevo.";
  }
}
const weather_response_city = document.getElementById("weather_response_city");
const weather_image = document.getElementById("weather_image");
const weather_response_degrees = document.getElementById(
  "weather_response_degrees"
);
const weather_response_expect = document.getElementById(
  "weather_response_expect"
);
const weather_response_degrees_min_max = document.getElementById(
  "weather_response_degrees_min_max"
);
const weather_wind = document.getElementById("weather_wind");
const weather_precipitation = document.getElementById("weather_precipitation");
const feels_like = document.getElementById("feels_like");
function drawData(dataCity) {
  errorContainer.style.display = "none";
  weather_container.style.opacity = 1;
  weather_response_city.textContent = dataCity.city;
  weather_image.src = dataCity.image;
  weather_response_expect.textContent = dataCity.weather_description;
  weather_response_degrees.textContent = dataCity.temp + "°C";
  weather_response_degrees_min_max.textContent =
    dataCity.temp_min + "°C" + " - " + dataCity.temp_max + "°C";
  weather_wind.textContent = dataCity.speed + "km/hr";
  weather_precipitation.textContent = dataCity.humidity + "%";
  feels_like.textContent = dataCity.feels_like + "°C";
  let url =
    "https://th.bing.com/th/id/OIP.ODF68Yqk4FnO3-Kcbie-3AHaFl?rs=1&pid=ImgDetMain";
  if (dataCity.temp < 10) {
    url = "./img/frio.png";
    weather_container.classList.add("bgc-text");
  } else if (dataCity.temp > 32) {
    url = "./img/sol.png";
    weather_container.classList.add("bgc-text");
  } else {
    url = "";
    weather_container.style.opacity = 1;
    weather_container.classList.remove("bgc-text");
  }
  weather_container.style.backgroundImage = `url(${url})`;
}