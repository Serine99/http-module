/**     HTTP
 * The HTTP interfaces in Node.js are designed to support many features of the protocol which have been traditionally difficult to use. In particular, large, possibly chunk-encoded, messages. The interface is careful to never buffer entire requests or responses, so the user is able to stream data.
 *In order to support the full spectrum of possible HTTP applications, the Node.js HTTP API is very low-level.
 *It deals with stream handling and message parsing only. It parses a message into headers and body but it does not parse the actual headers or the body.
 */

import { createServer } from "http";
import fs from "fs";
import path from "path";
const server = createServer((req, res) => {
  if (req.url === "/") {
    // res.writeHead(200, { "Content-Type": "text/plain" });
    // res.end("Welcome to my website!!!");
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(path.resolve("public/index.html")).pipe(res);
  } else if (req.url === "/style.css") {
    res.writeHead(200, { "Content-Type": "text/css" });
    fs.createReadStream(path.resolve("public/style.css")).pipe(res);
  } else if (req.url === "/hello") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World");
  } else if (req.url === "/bye") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ name: "Joe" }));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Data not found");
  }
});
server.listen(3001);

import http from "http";
import net from "net";
import { URL } from "url";
// Create an HTTP tunneling proxy
// const proxy = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('okay');
// });
// proxy.on('connect', (req, clientSocket, head) => {
//   // Connect to an origin server
//   const { port, hostname } = new URL(`http://${req.url}`);
//   const serverSocket = net.connect(port || 80, hostname, () => {
//     clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
//                     'Proxy-agent: Node.js-Proxy\r\n' +
//                     '\r\n');
//     serverSocket.write(head);
//     serverSocket.pipe(clientSocket);
//     clientSocket.pipe(serverSocket);
//   });
// });

// // Now that proxy is running
// proxy.listen(1337, '127.0.0.1', () => {

//   // Make a request to a tunneling proxy
//   const options = {
//     port: 1337,
//     host: '127.0.0.1',
//     method: 'CONNECT',
//     path: 'www.google.com:80'
//   };

//   const req = http.request(options);
//   req.end();

//   req.on('connect', (res, socket, head) => {
//     console.log('got connected!');

//     // Make a request over an HTTP tunnel
//     socket.write('GET / HTTP/1.1\r\n' +
//                  'Host: www.google.com:80\r\n' +
//                  'Connection: close\r\n' +
//                  '\r\n');
//     socket.on('data', (chunk) => {
//       console.log(chunk.toString());
//     });
//     socket.on('end', () => {
//       proxy.close();
//     });
//   });
// });

// const options = {
//   host: "127.0.0.1",
//   port: 8080,
//   path: "/length_request",
// };

// // Make a request
// const req = http.request(options);
// req.end();

// req.on("information", (info) => {
//   console.log(`Got information prior to main response: ${info.statusCode}`);
// });

http
  .get("http://localhost:8000/", (res) => {
    const { statusCode } = res;
    const contentType = res.headers["content-type"];

    let error;
    // Any 2xx status code signals a successful response but
    // here we're only checking for 200.
    if (statusCode !== 200) {
      error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(
        "Invalid content-type.\n" +
          `Expected application/json but received ${contentType}`
      );
    }
    if (error) {
      console.error(error.message);
      // Consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding("utf8");
    let rawData = "";
    res.on("data", (chunk) => {
      rawData += chunk;
    });
    res.on("end", () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);
      } catch (e) {
        console.error(e.message);
      }
    });
  })
  .on("error", (e) => {
    console.error(`Got error: ${e.message}`);
  });

// Create a local server to receive data from
const server1 = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      data: "Hello World!",
    })
  );
});

server1.listen(8000);
