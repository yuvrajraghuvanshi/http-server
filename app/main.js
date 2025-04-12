const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });
  socket.on("data", (data) => {
    console.log(data);
    const path = data.toString().split(" ")[1];
    if (path === "/") {
      socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
    }else{
    const responseStatus = path.startsWith(`/echo/`)
      ? "200 OK"
      : "404 Not Found";
    const lastRoute = path.replace(`/echo/`, "");
    console.log({ length: lastRoute.length });
    socket.write(
      `HTTP/1.1 ${responseStatus}\r\nContent-Type: text/plain\r\nContent-Length: ${lastRoute.length}\r\n\r\n${lastRoute}`
    );}
  });
});

server.listen(4221, "localhost");
