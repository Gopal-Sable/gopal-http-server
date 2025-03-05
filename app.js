const http = require("http");
const fs = require("fs/promises");

const port = 3000;

const server = http.createServer((req, res) => {
  switch (req.url) {
    case "/html":
      getHtml(res);
      break;
    case "/json":
      getJson(res);
      break;
    default:
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write("<h1>Hello</h1>");
      res.end();
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
