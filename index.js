const weatherForm = document.querySelector(".weatherForm");
const userInput = document.querySelector(".userInput");
const cityContainer = document.querySelector(".cityContainer");
const apiKey = "8a2bd56f34f68a2b7f4615ee0faebba4";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = userInput.value;

    if (city) {
        try {
            const weatherData = await fetchWeatherData(city);
            displayWeatherInfo(weatherData);
        }

        catch(error) {
            displayError(error);
        }
    }
    else {
        displayError("Please enter a city.");
    }
});

async function fetchWeatherData(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiURL);
    if (!response.ok) {
        throw new Error("Couldn't fetch data");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const errorContainer = document.querySelector(".errorContainer");
    errorContainer.style.display = "none";
    const { name: city, 
            main: {temp, humidity}, 
            weather: [{id, icon, description}], 
            sys: {sunrise, sunset}, 
            wind: {speed}
        } = data;
    cityContainer.style.display = "flex";

    document.querySelector(".weatherConditions").textContent = description;
    document.querySelector(".cityName").textContent = city;
    document.querySelector(".cityTemp").textContent = `${(kelvinToF(temp))}°F`;
    document.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
    document.querySelector(".wind-speed").textContent = `Wind Speed: ${speed} km/h`;
    document.querySelector(".sunrise").textContent = `Sunrise: ${unixToDate(sunrise)}`;
    document.querySelector(".sunset").textContent = `Sunset: ${unixToDate(sunset)}`;
    const forecastImage = document.querySelector(".forecastImage");
    forecastImage.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
}

function displayError(message) {
    cityContainer.style.display = "none";
    const errorContainer = document.querySelector(".errorContainer");
    errorContainer.textContent = message;
    errorContainer.style.display = "block"; 
}

function kelvinToF(temp) {
    return ((temp - 273.15) * 1.8 + 32).toFixed(2);
}

function unixToDate(unixTime) {
    const date = new Date(unixTime * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
