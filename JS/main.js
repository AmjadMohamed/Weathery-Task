const LocationInput = document.querySelector(".locationInput");
const locationName = document.querySelector(".locationName");
const temperature = document.querySelector(".temprature");
const temperatureCondition = document.querySelector(".temperatureCondition");
const temperatureImage = document.querySelector(".temperatureImage");
const clouds = document.querySelector(".clouds");
const wind = document.querySelector(".wind");
const windDirection = document.querySelector(".windDirection");
const hourlyReadings = document.querySelector(".hourlyReadingsContainer");
const daysReading = document.querySelector(".daysReadingsContainer");


LocationInput.addEventListener('input', function () {
    FetchCurrentWeatherForLocation(LocationInput.value);
});

window.addEventListener("DOMContentLoaded", FetchWeatherForMyCurrentLocation);

async function FetchCurrentWeatherForLocation(location) {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=208e8ceb7b634ad390a11206250407&q=${location}&days=7`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        if (!data) throw new Error("Invalid data structure");
        PopulateDataIntoElements(data);
        PopulateHourlyReadings(data);
        PopulateDaysReading(data);
    } catch (err) {
        console.error("Fetch error:", err.message);
    }
}

function FetchWeatherForMyCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                FetchCurrentWeatherForLocation(`${lat},${lon}`);
            },
            () => {
                FetchCurrentWeatherForLocation("Egypt");
            }
        );
    } else {
        FetchCurrentWeatherForLocation("Egypt");
    }
}

function PopulateDataIntoElements(data) {
    locationName.textContent = data.location.name;
    temperature.textContent = `${Math.round(data.current.temp_c)}°C`;
    temperatureCondition.textContent = data.current.condition.text;
    temperatureImage.src = "https:" + data.current.condition.icon;
    clouds.innerHTML = `<i class="fa-solid fa-cloud"></i> ${data.current.cloud}%`
    wind.innerHTML = `<i class="fa-solid fa-wind"></i>  ${data.current.wind_kph}km/h`
    windDirection.innerHTML = `<i class="fa-regular fa-compass"></i> ${data.current.wind_dir}`
}

function PopulateHourlyReadings(data) {
    const hoursArr = data.forecast.forecastday[0].hour;
    const currentHour = new Date().getHours();
    let ReadingItems = "";

    for (let i = 0; i < 24; i++) {
        const hour = parseInt(hoursArr[i].time.split(" ")[1].substring(0, 2), 10);
        const selectedClass = hour === currentHour ? "selectedItem " : "";
        ReadingItems += `
            <div
        class="${selectedClass}weatherHourlyItem d-flex flex-column justify-content-center align-items-center border border-1 rounded-4 p-3">
        <h2 class="time fs-5">${hoursArr[i].time.split(" ")[1].substring(0, 5)}</h2>
        <h1 class="temp">${Math.round(hoursArr[i].temp_c)}°C</h1>
        <img class = "icon" src="https:${hoursArr[i].condition.icon}" alt="weather icon">
    </div>
        `
    }

    hourlyReadings.innerHTML = ReadingItems;
}

function PopulateDaysReading(data) {
    const daysArr = data.forecast.forecastday;
    let dayName = new Date(daysArr[0].date).toLocaleDateString('en-US', { weekday: 'long' });
    let daysItems = `
            <div
        class="selectedItem weatherDayItem d-flex flex-column justify-content-center align-items-center border border-1 rounded-4 p-3">
        <h2 class="day">${dayName}</h2>
        <h2 class="date">${daysArr[0].date.substring(5)}</h2>
        <h1 class="temp">${Math.round(daysArr[0].day.avgtemp_c)}°C</h1>
        <img class="icon" src="https:${daysArr[0].day.condition.icon}" alt="weather icon">
    </div>
        `;

    for (let i = 1; i < 7; i++) {
        dayName = new Date(daysArr[i].date).toLocaleDateString('en-US', { weekday: 'long' });
        daysItems += `
            <div
        class="weatherDayItem d-flex flex-column justify-content-center align-items-center border border-1 rounded-4 p-3">
        <h2 class="day">${dayName}</h2>
        <h2 class="date">${daysArr[i].date.substring(5)}</h2>
        <h1 class="temp">${Math.round(daysArr[i].day.avgtemp_c)}°C</h1>
        <img class="icon" src="https:${daysArr[i].day.condition.icon}" alt="weather icon">
    </div>
        `
    }

    daysReading.innerHTML = daysItems;
}