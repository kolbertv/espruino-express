const http = require("http");

class Router {
  constructor(opts) {
    if (!opts)
      opts = {
        engine: "none" // default is 'none', some functions like 'GET static resourses' disabled
      };
    this.opts = opts;
    this.engine = opts.engine;
    this.routes = [];
    this.get = this.add.bind(this, "GET");
    this.post = this.add.bind(this, "POST");
    this.handler = this.handler.bind(this);
  }
  add(method, route, fn) {
    this.routes.push({ method: method, route: route, fn: fn });
    return this;
  }

  listen() {
    this.server = http.createServer(this.handler);
    this.server.listen.apply(this.server, arguments);
    return this;
  }

  find(method, path) {
    const arrOfRoutes = this.routes;
    for (let i = 0; i < arrOfRoutes.length; i++) {
      if (arrOfRoutes[i].route === path && arrOfRoutes[i].method === method) {
        return arrOfRoutes[i].fn;
        break;
      }
    }
    return (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(404);
      res.end(JSON.stringify({ titile: "page not found" }));
    };
  }

  bodyJsonDecode(data) {
    return JSON.parse(data);
  }

  bodyUrlDecode(data) {
    let bodyData = {};
    data.split("&").forEach(element => {
      const el = element.split("=");
      bodyData[el[0]] = el[1];
    });
    return bodyData;
  }

  bodyDataDecode(req, result) {
    const contentType =
      req.headers["Content-Type"] || req.headers["content-type"];
    switch (contentType) {
      case "application/json":
        return this.bodyJsonDecode(result);
        break;

      case "application/x-www-form-urlencoded":
        return this.bodyUrlDecode(result);

      default:
        return {
          error: `don't know mime type ${contentType}`
        };
        break;
    }
  }

  bodyLoad(req) {
    return new Promise((resolve, reject) => {
      try {
        let result = "";
        req.on("data", d => {
          result += d;
        });
        req.on("end", () => {
          resolve(this.bodyDataDecode(req, result));
        });
        req.on("error", err => {
          throw new Error(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  handler(req, res) {
    const result = this.find(req.method, req.url);
    if (req.method === "GET") {
      return result(req, res);
    } else {
      this.bodyLoad(req).then(data => {
        req.body = data;
        console.log(data);
        return result(req, res);
      });
    }
  }
}

export default opts => new Router(opts);
