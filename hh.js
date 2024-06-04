const http=require("http")
const fs=require("fs")
var requests = require('requests');

const homeFile=fs.readFileSync("home.html","utf-8");
const replaceVal=(tempVal,orgVal)=>{
  let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp)
  temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min)
  temperature=temperature.replace("{%tempmax%}",orgVal.main.temp_max)
  temperature=temperature.replace("{%location%}",orgVal.name)
  temperature=temperature.replace("{%country%}",orgVal.sys.country)
  return temperature
}

const server=http.createServer((req,res)=>{
    if(req.url==='/'){
        requests("https://api.openweathermap.org/data/2.5/weather?lat=12.971599&lon=77.594566&appid=6e8d995b79b8ca13d290d546b8322793")
.on('data', function (chunk) {
    const objdata=JSON.parse(chunk);
    const arrData=[objdata]

  // console.log(arrData[0].main.temp);
  const realTimeData=arrData.map((val)=>replaceVal(homeFile,val)).join("");
  res.write(realTimeData)
  // console.log(realTimeData)
})
.on('end', function (err) {
  if (err) return console.log('connection closed due to errors', err);
   res.end()

});
    }
})
server.listen(9000,"127.0.0.1");
// const replaceVal = (tempVal, orgVal) => {
//   let replacedTemp = tempVal.replace("{%tempval%}", orgVal.main.temp-273.15)
//     .replace("{%tempmin%}", orgVal.main.temp_min-273.15)
//     .replace("{%tempmax%}", orgVal.main.temp_max-273.15)
//     .replace("{%location%}", orgVal.name)
//     .replace("{%country%}", orgVal.sys.country);
//   return replacedTemp;
// }