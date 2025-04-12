const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });
  socket.on("data", (data) => {
    const value = data.toString().split("\r\n");
    const path = data.toString().split(" ")[1];
    data = data.toString();
    const lines = value.find((v) => v.toLowerCase().startsWith("user-agent:"));
    const showValue = lines ? lines.split(": ")[1] : "Unknown";
    if (path === "/user-agent") {
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${showValue.length}\r\n\r\n${showValue}`
      );
    } else if (path.includes("/echo/")) {
      const content = data.split("/echo/")[1];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`
      );
    } else {
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\n`);
    }
  });
});

server.listen(4221, "localhost");
