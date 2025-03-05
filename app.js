const http = require("http");
const fs = require("fs/promises");

const port = 3000;

const server = http.createServer((req, res) => {
  switch (req.url) {
    case "/html":
      getHtml(res);
      break;

    default:
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
