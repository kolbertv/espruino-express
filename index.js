// EXAMPLE of using router.cjs

//start <-- Init of Espruino
// const wifi = require("Wifi");
// E.on("init", () => {
//   //start <-- Connect SD card to ESP32 and Espruino
//   const spiSDCard = new SPI();
//   spiSDCard.setup({ mosi: D15, miso: D2, sck: D14 });
//   E.connectSDCard(spiSDCard, D13);
//   //end --> Connect SD card to ESP32 and Espruino
//   // console.log(require("fs").readdirSync()); //reading root folder for testing
// });
// //end --> Init of Espruino

import router from "./lib/router.cjs";
const port = 80;

// for develop in nodeJS need to comment next string, for upload to Espruino uncomment
// const main = (onInit = () => {
router({ engine: "nodejs" }) // for node.js {engine :'nodejs'}, for ESP32 {engine :'ESP32'}, default is 'none', some functionality like 'GET static resourses' disabled
  // for now only simple GET request without :id and queries
  .get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "max-age=3600");

    res.writeHead(200);
    const a = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <link rel="shortcut icon" href="/public/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/public/favicon.ico" type="image/x-icon">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>index file</title>
    </head>
    <body>
    <h2>main page</h2>
    <img src="/public/2.jpeg" alt="some name">
    <h2>main page</h2>
    </body></html>
    `;
    res.end(a);
  })
  // for now only simple GET request without :id and queryes
  .get("/users", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({ titile: `GET users` }));
  })
  //for now only simple POST request with body containing JSON or urlEncoded data
  .post("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({ titile: `POST /`, body: req.body }));
  })
  // folder for stacic data, may contain files and folders, types only from mimeTipes.cjs
  .public("/public")
  .listen(port, err => {
    if (err) throw err;
    console.log(`running server on port: ${port}`);
  });
// for develop in nodeJS need to comment next string, for upload to Espruino uncomment
// });
