const http = require("http");
const fs = require("fs/promises");
const uuid = require("crypto");
const { json } = require("stream/consumers");

const port = 3000;

const server = http.createServer((req, res) => {
  let statusRegx = /^\/status\/(\d+)$/;
  let delayRegx = /^\/delay\/(\d+)$/;
  console.log("hi");

  switch (true) {
    case req.url === "/html":
      getHtml(res);
      break;
    case req.url === "/json":
      getJson(res);
      break;

    case req.url === "/uuid":
      getUuid(res);
      break;

    case statusRegx.test(req.url):
      printStatus(res, req.url);
      break;

    case delayRegx.test(req.url):
      delayRequest(res, req.url);
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/html" });
      res.write("<h1>Page not found</h1>");
      res.end(req.url);
      break;
  }
});

server.listen(port, (error) => {
  if (error) {
    console.log("Something went wrong", error);
  } else {
    console.log("Server running on port", port);
  }
});

function getHtml(res) {
  fs.readFile("index.html")
    .then((data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.write(data);
    })
    .catch((err) => {
      res.writeHead(404);
      res.write("Page not found");
    })
    .finally(() => {
      res.end();
    });
}

function getJson(res) {
  let data = {
    slideshow: {
      author: "Yours Truly",
      date: "date of publication",
      slides: [
        {
          title: "Wake up to WonderWidgets!",
          type: "all",
        },
        {
          items: [
            "Why <em>WonderWidgets</em> are great",
            "Who <em>buys</em> WonderWidgets",
          ],
          title: "Overview",
          type: "all",
        },
      ],
      title: "Sample Slide Show",
    },
  };

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(data));
  res.end();
}

function getUuid(res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify({ uuid: uuid.randomUUID() }));
  res.end();
}

function printStatus(res, url) {
  let status = url.split("/")[2];
  if (status >= 100 && status <= 599) {
    res.writeHead(status);
  } else {
    res.writeHead(500);
    res.write("Invalid status code: ");
  }
  res.end(status);
}

function delayRequest(res, url) {
  let delay = url.split("/")[2] * 1000;
  setTimeout(() => {
    res.writeHead(200);

    res.end(`${delay}`);
  }, delay);
}
