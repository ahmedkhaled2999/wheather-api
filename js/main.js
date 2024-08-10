// https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=maVgNo3IKVd7Pw7-_q4fywxtQCACntlNXKBBsFdrBzI&per_page=5&orientation=landscape

let apiKey = "d52a781c79dc4706a50160858241206 ";
let cardsContainer = document.querySelector(".forecast-cards");
let searchBox = document.querySelector("#searchBox");
let cityData = document.querySelector(".city-items");
let allBars = document.querySelectorAll(".clock");
let recentCitis;

if (localStorage.getItem("cities")) {
  recentCitis = JSON.parse(localStorage.getItem("cities"));
} else {
  recentCitis = [];
}

let locationName = document.querySelector(".location .location");
async function getWeather(country) {
  let response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${country}&days=3`
  );

  if (!response.ok) {
    console.log("hiiiiiiiiiiiiii");
    Swal.fire("Location not found. Please enter a valid city name.");
  }
  let result = await response.json();

  let exits = recentCitis.find(function (el) {
    return el.city == result.location.name;
  });

  if (exits == undefined) {
    displayImg(result.location.name, result.location.country);
    recentCitis.push({
      city: result.location.name,
      country: result.location.country,
    });
    console.log(recentCitis);
  } else {
    displayImg("");
  }

  localStorage.setItem("cities", JSON.stringify(recentCitis));
  displayWeather(result);
}

// console.log(date.toLocaleDateString("en-us", {weekday:"long"}));
function displayWeather(result) {
  let forcast = result.forecast.forecastday;

  let cartona = "";
  locationName.innerHTML = result.location.name;
  for (let i = 0; i < forcast.length; i++) {
    let date = new Date(forcast[i].date);
    let weekDay = date.toLocaleDateString("en-us", { weekday: "long" });
    // console.log(date.toLocaleDateString("en-us", {weekday:"long"}));
    cartona += `   
       <div class="card ${i == 0 ? "active" : ""}" data-index=${i} >
        <div class="card-header">
          <div class="day">${weekDay}</div>
        </div>
        <div class="card-body">
          <img src="./images/conditions/${forcast[i].day.condition.text}.svg"/>
          <div class="degree">${forcast[i].hour[date.getHours()].temp_c}°C</div>
        </div>
        <div class="card-data">
          <ul class="left-column">
            <li>Real Feel: <span class="real-feel">${
              forcast[0].hour[date.getHours()].feelslike_c
            }°C</span></li>
            <li>Wind: <span class="wind">${
              forcast[i].hour[date.getHours()].wind_kph
            } K/h</span></li>
            <li>Pressure: <span class="pressure">${
              forcast[i].hour[date.getHours()].pressure_mb
            } Mb</span></li>
            <li>Humidity: <span class="humidity">${
              forcast[i].hour[date.getHours()].humidity
            } %</span></li>
          </ul>
          <ul class="right-column">
            <li>Sunrise: <span class="sunrise"> ${
              forcast[i].astro.sunrise
            }  </span></li>
            <li>Sunset: <span class="sunset">${
              forcast[i].astro.sunset
            }</span></li>
          </ul>
        </div>
      </div>
`;
  }
  // console.log(cartona);

  cardsContainer.innerHTML = cartona;
  let allCards = document.querySelectorAll(".card");
  // console.log(allCards);
  for (let i = 0; i < allCards.length; i++) {
    allCards[i].addEventListener("click", function (e) {
      console.log(e.target);
      console.log(e.currentTarget);
      let activeCard = document.querySelector(".card.active");
      activeCard.classList.remove("active");
      e.currentTarget.classList.add("active");
      rain(forcast[e.currentTarget.dataset.index].hour);
    });
  }
}

function rain(weather) {
  for (let i = 0; i < allBars.length; i++) {
    console.log(allBars);
    // console.log(weather[allBars[i].getAttribute("data-clock")].chance_of_rain);
    // console.log(allBars[i].querySelector(".percent"));
    let height = weather[allBars[i].getAttribute("data-clock")].chance_of_rain;
    allBars[i].querySelector(".percent").style.height = `${height}%`;
  }
}

function success(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let currentPosition = `${latitude},${longitude}`;

  getWeather(currentPosition);
}

function error() {
  getWeather("cairo");
}

searchBox.addEventListener("keyup", function (e) {
  // console.log(searchBox.value);
  // console.log(e);
  if (e.key == "Enter") {
    // console.log(searchBox.value);
    getWeather(searchBox.value);
    searchBox.value = null;
  }
});

// searchBox.addEventListener("blur", function(){
//     // console.log(searchBox.value);
//     getWeather(searchBox.value)
// })

async function getImg(city) {
  let response = await fetch(
    `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=maVgNo3IKVd7Pw7-_q4fywxtQCACntlNXKBBsFdrBzI&per_page=5&orientation=landscape`
  );
  let result = await response.json();

  let randomIndex = Math.floor(Math.random() * result.results.length); //=>0-0.9999999
  let cityData = result.results[randomIndex];

  return cityData;
}

async function displayImg(city, country) {
  if (city === "clearall") {
    // Clear all cities
    recentCitis = [];
    localStorage.removeItem("cities");
    document.querySelector(".city-items").innerHTML = ""; // Clear city items in UI
    return;
  }

  let cityInfo = await getImg(city);
  // console.log(cityInfo.urls.regular);

  let item = `<div class="item">
<div class="city-image">
  <img src="${cityInfo.urls.regular}"  data.city="${city}"  alt="Image for ${city} city" />
</div>
<div class="city-name"><span class="city-name">${city}</span>, ${country}</div>
</div>`;

  // when you click to img you show  you wheathet of city
  cityData.innerHTML += item;
  let licationimg = document.querySelectorAll(".city-image");
  for (let l = 0; l < licationimg.length; l++) {
    licationimg[l].addEventListener("click", function (el) {
      let loctionIMG = el.target.getAttribute("data.city");
      console.log(loctionIMG);
      getWeather(loctionIMG);
    });
  }
}

window.addEventListener("load", function () {
  navigator.geolocation.getCurrentPosition(success, error);
  for (const city of recentCitis) {
    displayImg(city.city, city.country);
  }
});

// to clear all city of wheather
let clear = document.getElementById("clearall");
clear.addEventListener("click", function () {
  displayImg("clearall");
  getWeather("Alexandria");
});
