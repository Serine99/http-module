/**     HTTP
 * The HTTP interfaces in Node.js are designed to support many features of the protocol which have been traditionally difficult to use. In particular, large, possibly chunk-encoded, messages. The interface is careful to never buffer entire requests or responses, so the user is able to stream data.
 *
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
