import router from "./lib/router.cjs";
const port = 80;

// for develop in nodeJS need to comment next string, for upload to Espruino uncomment
// const main = (onInit = () => {
router({ engine: "nodejs" }) // for node.js {engine :'nodejs'}, for ESP32 {engine :'ESP32'}, default is 'none', some functionality like 'GET static resourses' disabled
  .get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({ titile: "GET /" }));
  })
  .get("/users", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({ titile: `GET users` }));
  })
  .post("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({ titile: `POST /`, body: req.body }));
  })
  .listen(port, err => {
    if (err) throw err;
    console.log(`running server on port: ${port}`);
  });
// for develop in nodeJS need to comment next string, for upload to Espruino uncomment
// });
