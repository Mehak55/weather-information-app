const apiKey = "0ae08f29bb745ce9d437afb06dd6572c"; 

const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");

const landing = document.getElementById("landing");
const app = document.getElementById("app");

const backBtn = document.getElementById("backBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");

const canvas = document.getElementById("weatherCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

// Submit the form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city === "") return alert("Please enter a city name!");
  getWeather(city);
});

// Go back to input page
backBtn.addEventListener("click", () => {
  app.classList.add("hidden");
  landing.classList.remove("hidden");
  particles = [];
});

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    showWeatherPage();
    updateUI(data);
  } catch (error) {
    alert(error.message);
  }
}

function showWeatherPage() {
  landing.classList.add("hidden");
  app.classList.remove("hidden");
}

function updateUI(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `Temperature: ${data.main.temp} °C`;
  description.textContent = `Weather: ${data.weather[0].description}`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
  wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;

  const weather = data.weather[0].main.toLowerCase();
  app.className = "app"; // reset classes
  particles = [];

  // Reset text color each time
  app.classList.remove("dark-text", "light-text");

  if (weather.includes("clear")) {
    app.classList.add("clear", "dark-text"); // bright sky
    weatherIcon.innerHTML = "☀️";
  } else if (weather.includes("rain") || weather.includes("drizzle")) {
    app.classList.add("rain", "light-text");
    weatherIcon.innerHTML = "🌧️";
    createRain();
  } else if (weather.includes("snow")) {
    app.classList.add("snow", "dark-text"); // white background
    weatherIcon.innerHTML = "❄️";
    createSnow();
  } else if (weather.includes("mist") || weather.includes("fog") || weather.includes("haze")) {
    app.classList.add("mist", "light-text");
    weatherIcon.innerHTML = "🌫️";
  } else if (weather.includes("cloud")) {
    app.classList.add("clouds", "light-text");
    weatherIcon.innerHTML = "☁️";
  } else {
    app.classList.add("clear", "dark-text");
    weatherIcon.innerHTML = "☀️";
  }
}

/* Particle Effects */
function createRain() {
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      l: Math.random() * 1 + 1,
      xs: Math.random() * 2 - 1,
      ys: Math.random() * 10 + 4
    });
  }
}

function createSnow() {
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 1,
      d: Math.random() * 1
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    if (p.ys) { // Rain
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.xs, p.y + p.ys);
      ctx.strokeStyle = "rgba(174,194,224,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      p.x += p.xs;
      p.y += p.ys;
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    } else { // Snow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
      ctx.fillStyle = "white";
      ctx.fill();
      p.y += Math.pow(p.d, 2) + 1;
      if (p.y > canvas.height) {
        p.y = -p.r;
        p.x = Math.random() * canvas.width;
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
