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

  const pathParamsBitcoin = "ticker/tBTCUSD";
  const pathParamsEphyr = "ticker/tETHUSD";
  const queryParams = "";

  console.log("Request");
  try {
    const reqBitcoin = await fetch(`${bitfinex_url}/${pathParamsBitcoin}?${queryParams}`);
    const reqEphyr = await fetch(`${bitfinex_url}/${pathParamsEphyr}?${queryParams}`);
    const responseBitcoin = await reqBitcoin.json();
    const responseEphyr = await reqEphyr.json();
    console.log("Request result Bitcoin:" + JSON.stringify(responseBitcoin));
    console.log("Request result Ephyr:" + JSON.stringify(responseEphyr));
    if (io.engine.clientsCount > 0) {
      msgBitcoin = {
        name:"Bitcoin",
        bid: responseBitcoin[0],
        ask: responseBitcoin[2],
        daily_change: responseBitcoin[4],
        daily_change_relative: responseBitcoin[5]
      };
      msgEphyr = {
        name:"Ephyr",
        bid: responseEphyr[0],
        ask: responseEphyr[2],
        daily_change: responseEphyr[4],
        daily_change_relative: responseEphyr[5]
      };
      io.sockets.emit("tickerBitcoin", msgBitcoin);
      io.sockets.emit("tickerEphyr", msgEphyr);
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
