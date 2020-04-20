const express = require("express");
const cors = require("cors");

const fetch = require("node-fetch");

let app = express();
let server = require("http").createServer(app);

let io = require("socket.io")(server);

app.use(cors());

var timer = undefined;

io.on("connection", socket => {
  console.log("a user connected");
  startTimer();
  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (io.engine.clientsCount == 0) {
      console.log("Last client disconnected!");
      clearTimer();
    }
  });
});

server.listen(4000, () => {
  console.log("Server start listening on *:4000");
});

function startTimer() {
  if (!timer) {
    timer = setTimeout(function callback() {
      request();
    }, 2000);
  }
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = undefined;
  }
}

async function request() {
  const bitfinex_url = "https://api-pub.bitfinex.com/v2/";

  const pathParams = "ticker/tBTCUSD";
  const queryParams = "";

  console.log("Request");
  try {
    const req = await fetch(`${bitfinex_url}/${pathParams}?${queryParams}`);
    const response = await req.json();
    console.log("Request result:" + JSON.stringify(response));
    if (io.engine.clientsCount > 0) {
      msg = {
        bid: response[0],
        ask: response[2],
        daily_change: response[4],
        daily_change_relative: response[5]
      };
      io.sockets.emit("ticker", msg);
    }
    timer = undefined;
    startTimer();
  } catch (err) {
    console.log(JSON.stringify(err));
    clearTimer();
    startTimer();
  }
}

app.use(express.static(__dirname + "/"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
