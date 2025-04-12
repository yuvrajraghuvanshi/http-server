const net = require("net");

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
    console.log("heeelle", data.toString().split(" ")[1]);
    console.log("heeelle", value);
    if (path === "/user-agent") {
      const userAgent = value[2];
      console.log("first",userAgent.length)
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
      socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
    }
  });
});

server.listen(4221, "localhost");
