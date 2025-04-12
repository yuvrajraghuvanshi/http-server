const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });
  socket.on("data", (data) => {
    const value = data.toString().split('\r\n');
    const path = data.toString().split(" ")[1];
    const lines=value.find(v=>v.toLowerCase().startsWith('user-agent'));
    if (path === "/user-agent") {
    //   socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
    socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${lines.length}\r\n\r\n${lines}`
      );
    }else{
        socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
  }});
});

server.listen(4221, "localhost");
