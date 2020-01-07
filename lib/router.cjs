const http = require("http");
const fs = require("fs");
import mime from "./mimeTypes.cjs";

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
    // this.static = this.static.bind(this, "GET");
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

  find(method, url) {
    console.log(url);
    const arrOfRoutes = this.routes;
    for (let i = 0; i < arrOfRoutes.length; i++) {
      if (arrOfRoutes[i].route === url && arrOfRoutes[i].method === method) {
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
    const contentType = {};
    Object.keys(req.headers).forEach(elem => {
      contentType[elem.toLowerCase()] = req.headers[elem];
    });

    switch (contentType["content-type"]) {
      case "application/json":
        return this.bodyJsonDecode(result);
        break;

      case "application/x-www-form-urlencoded":
        return this.bodyUrlDecode(result);
        break;

      default:
        return {
          error: `router don't know mime type: ${contentType}`
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

  public(path) {
    if (this.opts.engine === "none") {
      return this;
    } else {
      const _espReadDirAsync = path => {
        const files = fs.readdirSync(path);
        const arr = [];
        files.forEach(elem => {
          if (!(elem === "." || elem === "..")) {
            arr.push(elem);
          }
        });
        return arr;
      };

      const _espIsDirAsync = path => {
        return fs.statSync(path).dir;
      };

      const _nodeReadDirAsync = path => {
        return fs.readdirSync(`.${path}`);
      };

      const _nodeIsDirAsync = path => {
        return fs.statSync(`.${path}`).isDirectory();
      };

      const _file = engine => {
        switch (engine) {
          case "nodejs":
            _file.readDir = _nodeReadDirAsync;
            _file.isDir = _nodeIsDirAsync;
            break;
          case "ESP32":
          default:
            _file.readDir = _espReadDirAsync;
            _file.isDir = _espIsDirAsync;
            break;
        }
        return _file;
      };

      const fn = (req, res) => {
        const end = req.url.split(".")[1];
        res.setHeader("Content-Type", `"${mime[end]}"`);
        res.setHeader("Cache-Control", "max-age=3600");
        res.writeHead(200);
        const data = fs.readFileSync(`.${req.url}`);
        console.log("load ok");
        res.end(data);
      };

      const readDir = _file(this.engine).readDir;
      const isDir = _file(this.engine).isDir;
      const arrOfUrl = path => {
        let arrOfFiles = [];
        const files = readDir(path);
        arrOfFiles = files.map(elem => {
          const dir = isDir(`${path}/${elem}`);
          return dir ? arrOfUrl(`${path}/${elem}`) : `${path}/${elem}`;
        });
        return arrOfFiles.reduce((a, f) => a.concat(f), []);
      };

      const cashOfUrl = arrOfUrl(path);
      // console.log(cashOfUrl); // for testing reading file with path
      cashOfUrl.forEach(element => {
        this.routes.push({ method: "GET", route: element, fn: fn });
      });
      return this;
    }
  }

  handler(req, res) {
    const result = this.find(req.method, req.url);
    switch (req.method) {
      case "POST":
        this.bodyLoad(req).then(data => {
          req.body = data;
          console.log(data);
          return result(req, res);
        });
        break;
      case "GET":
      default:
        return result(req, res);
        break;
    }
  }
}

export default opts => new Router(opts);
