document.addEventListener("DOMContentLoaded", function () {
    let checkWeatherBtn = document.getElementById("checkWeatherBtn");

    checkWeatherBtn.addEventListener("click", function () {
        let zip = document.getElementById("zipcode").value;
        getWeather(zip);
    });
});

function getWeather(zip) {
    let apiKey = "5229f77252f719547c86f12f14424ff1"; // OpenWeather API Key
    let url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${apiKey}&units=imperial`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                alert("Invalid ZIP code. Try again.");
                return;
            }

            // Extract weather details
            let temperature = `${data.main.temp} °F`;
            let windSpeed = `${data.wind.speed} mph`;
            let visibility = data.visibility ? `${(data.visibility / 1609).toFixed(2)} miles` : "N/A";
            let condition = data.weather[0].description;

            // Display weather info
            document.getElementById("temp").innerText = temperature;
            document.getElementById("wind").innerText = windSpeed;
            document.getElementById("visibility").innerText = visibility;
            document.getElementById("condition").innerText = condition;
            document.getElementById("weather-result").style.display = "block";

            // Drone safety logic
            let warning = "";
            if (parseFloat(data.wind.speed) > 22) {
                warning += "⚠️ Wind speed is too high for drone deliveries!\n";
            }
            if (visibility !== "N/A" && parseFloat(visibility) < 0.5) {
                warning += "⚠️ Visibility is too low for safe flights!\n";
            }

            if (warning !== "") {
                alert(warning);
            }
        })
        .catch(error => {
            console.error("Error fetching weather:", error);
            alert("Weather data is unavailable. Try again later.");
        });
}
