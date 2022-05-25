const wrapper = document.querySelector(".wrapper");

const itemPart = document.querySelector(".item");
const itemText = document.querySelector(".itemText");
const inputField = document.querySelector(".itemInput");
const locationBtn = document.querySelector(".itemBtn");
const weatherIcon = document.querySelector(".weatherImg");
const returnIcon = document.querySelector(".return")

let apiKey = `bedf0b4f3bd09470c08734e629403449`,
  api;

inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && e.target.value) {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    //check browser support geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation...");
  }
});

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function fetchData() {
  itemText.innerHTML = "Getting weather details...";
  itemText.classList.add("pending");
  fetch(api)
    .then((res) => res.json())
    .then((result) => weatherDetails(result));
}

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  itemText.innerHTML = error.message;
  itemText.classList.add("error");
}

function weatherDetails(info) {
  if (info.cod == "404") {
    itemText.innerHTML = `${inputField.value} isn't a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id == 800) {
      weatherIcon.src = "/img/clear.svg";
    } else if (id >= 200 && id <= 232) {
      weatherIcon.src = "/img/storm.svg";
    } else if (id >= 600 && id <= 622) {
      weatherIcon.src = "/img/snow.svg";
    } else if (id >= 701 && id <= 781) {
      weatherIcon.src = "/img/haze.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      weatherIcon.src = "/img/rain.svg";
    }

    wrapper.querySelector(".temp .numb").innerHTML = Math.floor(temp);
    wrapper.querySelector(
      ".weatherLocation span"
    ).innerHTML = `${country}, ${city}`;
    wrapper.querySelector(".weatherNow").innerHTML = description;
    wrapper.querySelector(".temp .numb-2").innerHTML = Math.floor(feels_like);
    wrapper.querySelector(".detailsHumidity span").innerHTML = `${humidity}%`;

    itemText.classList.remove("pending", "error");
    wrapper.classList.add("active");
    console.log(info);
  }
}

returnIcon.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
    // inputField.value = "";
    // inputField.focus();
})
