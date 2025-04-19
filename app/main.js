const net = require("net");
const fs = require("fs");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });
  socket.on("data", (data) => {
    const request = data.toString();
    const headers = request.split("\r\n");
    const lines = headers.find((h) =>
      h.toLowerCase().startsWith("user-agent:")
    );
    const value = lines ? lines.split(": ") : "Unknown";
    const path = data.toString().split(" ")[1];
    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (path.startsWith("/files")) {
      const args = process.argv[3];
      const fileName = path.replace("/files/", "");
      if (fs.existsSync(`${args}/${fileName}`)) {
        const content = fs.readFileSync(`${args}/${fileName}`);
        socket.write(
          `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}\r\n`
        );
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }
    } else if (path === "/user-agent") {
      const userAgent = value[1];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`
      );
    } else if (path.startsWith(`/echo/`)) {
      const responseStatus = path.startsWith(`/echo/`)
        ? "200 OK"
        : "404 Not Found";
      const lastRoute = path.replace(`/echo/`, "");
      console.log({ length: lastRoute.length });
      socket.write(
        `HTTP/1.1 ${responseStatus}\r\nContent-Type: text/plain\r\nContent-Length: ${lastRoute.length}\r\n\r\n${lastRoute}`
      );
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });
});

server.listen(4221, "localhost");
