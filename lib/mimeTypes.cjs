export default type => {
  return {
    js: "application/javascript",
    json: "application/json",
    ttf: "font/ttf",
    eot: "font/eot",
    otf: "font/otf",
    woff: "font/woff",
    woff2: "font/woff2",
    svg: "image/svg+xml",
    png: "image/png",
    gif: "image/gif",
    jpg: "image/jpg",
    css: "text/css",
    html: "text/html"
  }[type];
};
