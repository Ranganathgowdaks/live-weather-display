const http = require("http");
const fs = require("fs");
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
  // Convert temperatures from Kelvin to Celsius
  const tempCelsius = orgVal.main.temp - 273.15;
  const tempMinCelsius = orgVal.main.temp_min - 273.15;
  const tempMaxCelsius = orgVal.main.temp_max - 273.15;

  // Update the HTML template with Celsius temperatures
  let replacedTemp = tempVal.replace("{%tempval%}", `${tempCelsius.toFixed(2)} °C`)
    .replace("{%tempmin%}", `${tempMinCelsius.toFixed(2)} °C`)
    .replace("{%tempmax%}", `${tempMaxCelsius.toFixed(2)} °C`)
    .replace("{%tempStatus%}",orgVal.weather[0].main)
    .replace("{%location%}", orgVal.name)
    .replace("{%country%}", orgVal.sys.country);
    

  return replacedTemp;
}


const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Handle API request and replace values in HTML template (same as before)
    const apiRequest = requests("https://api.openweathermap.org/data/2.5/weather?lat=12.971599&lon=77.594566&appid=6e8d995b79b8ca13d290d546b8322793");

    let data = '';

    apiRequest.on('data', function (chunk) {
      data += chunk;
    });

    apiRequest.on('end', function () {
      try {
        const objdata = JSON.parse(data);
        const arrData = [objdata];

        const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
        res.write(realTimeData);
        res.end();
      } catch (err) {
        console.log('Error parsing JSON:', err);
        res.end();
      }
    });

    apiRequest.on('error', function (err) {
      console.log('API request error:', err);
      res.end();
    });
  } else if (req.url === '/home.css') {
    // Serve CSS file
    const cssFile = fs.readFileSync("home.css", "utf-8");
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.write(cssFile);
    res.end();
  }
});

server.listen(9000, "127.0.0.1");
