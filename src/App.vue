<template>
  <div id="app">
    <div
      class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm headerContainer"
    >
      <h5 class="my-0 mr-md-auto">Get Bitcoin</h5>
      <h6 v-bind:class="connectionStateClass">Connected</h6>
    </div>
    <div class="container">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Bid</th>
            <th scope="col">Ask</th>
            <th scope="col">Daily Change(Daily Change Relative)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="nameText">{{tickerBitcoin.name}}</td>
            <td v-bind:class="askClassBitcoin">{{ tickerBitcoin.ask }}</td>
            <td v-bind:class="bidClassBitcoin">{{ tickerBitcoin.bid }}</td>
            <td v-bind:class="dailyChangeClassBitcoin">{{ tickerBitcoin.daily_change }}({{tickerBitcoin.daily_change_relative}})</td>
          </tr>
           <tr>
            <td class="nameText">{{tickerEphyr.name}}</td>
            <td v-bind:class="askClassEphyr">{{ tickerEphyr.ask }}</td>
            <td v-bind:class="bidClassEphyr">{{ tickerEphyr.bid }}</td>
            <td v-bind:class="dailyChangeClassEphyr">{{ tickerEphyr.daily_change }}({{tickerEphyr.daily_change_relative}})</td>
          </tr>
        </tbody>
      </table>
      <div class="row">
        <div class="col-md infoContainer">
          <span>
            <b>Bitcoin</b> - A peer-to-peer payment system using the unit of the
            same name for accounting transactions. Cryptographic methods are
            used to ensure the functioning and protection of the system, but all
            information about transactions between the system addresses is
            available in clear text.
          </span>
        </div>
        <div class="col-md infoContainer">
          <span>
            Bitcoins can be used to exchange goods or services with sellers who
            agree to accept them. Exchange for regular currencies occurs through
            the online digital currency exchange service, other payment systems,
            exchange offices or directly between interested parties. The
            commission for conducting operations is appointed by the sender
            voluntarily, the size of the commission affects the priority when
            processing the transaction. Typically, the client program prompts
            the recommended size of the commission. Transactions without a
            commission are possible and also processed, but are not recommended,
            since their processing time is unknown and can be quite large.
          </span>
        </div>
        <div class="col-md infoContainer">
          <span>
            One of the main features of the system is complete decentralization:
            there is no central administrator or any analogue of it. A necessary
            and sufficient element of this payment system is the basic client
            program (it has open source code). Client programs launched on many
            computers are connected to each other in a peer-to-peer network,
            each node of which is equal and self-sufficient. It is impossible to
            publicly or privately control the system, including changing the
            total number of bitcoins.
          </span>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row imgContainer"></div>
    </div>

    <div class="card footerContainer">
      <div class="card-header">
        Get Bitcoin
      </div>
      <div class="card-body">
        <blockquote class="blockquote mb-0">
          <p>
            Created by Grid Dynamics University student Kriuchenkov Oleh
            <span class="follow">Follow me)</span>
          </p>
          <footer class="blockquote-footer">
            Copyright &copy; 2020
            <div class="follows">
              <div class="icon specialIcon">
                <a href="https://www.linkedin.com/in/oleh-kriuchenkov-6573a51a0"
                  >LinkedIn</a
                >
              </div>
              <div class="icon">
                <a href="https://www.instagram.com/single_fig/">Instagram</a>
              </div>
            </div>
          </footer>
        </blockquote>
      </div>
    </div>
  </div>
</template>

<script>
var socket = io("http://localhost:4000");
const null_ticker = {
  name:undefined,
  bid: 0,
  ask: 0,
  daily_change: 0,
  daily_change_relative: 0
};
export default {
  name: "app",
  data() {
    return {
      isConnected: false,
      prev_ticker_bitcoin: undefined,
      prev_ticker_ephyr: undefined,
      tickerBitcoin: null_ticker,
      tickerEphyr: null_ticker
    };
  },
  created() {
    socket.on("connect", () => {
      console.log("Socket connected: " + socket.connected);
      this.isConnected = true;
    });
    socket.on("disconnect", () => {
      console.log("Socket dicconnected: " + socket.disconnected);
      this.isConnected = false;
    });
    socket.on("tickerBitcoin", data => {
      console.log("New ticker bitcoin:" + JSON.stringify(data));
      this.prev_ticker_bitcoin = this.tickerBitcoin;
      this.tickerBitcoin = data;
    });
    socket.on("tickerEphyr", data => {
      console.log("New ticker ephyr:" + JSON.stringify(data));
      this.prev_ticker_ephyr = this.tickerEphyr;
      this.tickerEphyr = data;
    });
  },
  computed: {
    connectionStateClass: function() {
      if (this.isConnected) return "connected";
      return "dicconnected";
    },
    askClassBitcoin: function() {
      if (this.prev_ticker_bitcoin) {
        if (this.tickerBitcoin.ask < this.prev_ticker_bitcoin.ask) return "ticker_red";
        else if(this.tickerBitcoin.ask === this.prev_ticker_bitcoin.ask) return "ticker_yellow";
        return "ticker_green";
      }
      return "ticker_green";
    },
    bidClassBitcoin: function() {
      if (this.prev_ticker_bitcoin) {
        if (this.tickerBitcoin.bid < this.prev_ticker_bitcoin.bid) return "ticker_red";
        else if(this.tickerBitcoin.bid === this.prev_ticker_bitcoin.bid) return "ticker_yellow";
        return "ticker_green";
      }
      return "ticker_green";
    },
    dailyChangeClassBitcoin: function() {
      if(this.prev_ticker_bitcoin) {
        if(this.tickerBitcoin.daily_change < this.prev_ticker_bitcoin.daily_change) return "ticker_red";
        else if(this.tickerBitcoin.daily_change === this.prev_ticker_bitcoin.daily_change) return "ticker_yellow";
        return "ticker_green";
      }
      return "ticker_green";
    },
    askClassEphyr: function() {
      if (this.prev_ticker_ephyr) {
        if (this.tickerEphyr.ask < this.prev_ticker_ephyr.ask) return "ticker_red";
        else if(this.tickerEphyr.ask === this.prev_ticker_ephyr.ask) return "ticker_yellow";
        return "ticker_green";
      }
      return "ticker_green";
    },
    bidClassEphyr: function() {
      if (this.prev_ticker_ephyr) {
        if (this.tickerEphyr.bid < this.prev_ticker_ephyr.bid) return "ticker_red";
        else if(this.tickerEphyr.bid === this.prev_ticker_ephyr.bid) return "ticker_yellow";
        return "ticker_green";
      }
      return "ticker_green";
    },
    dailyChangeClassEphyr: function() {
      if(this.prev_ticker_ephyr) {
        if(this.tickerEphyr.daily_change < this.prev_ticker_ephyr.daily_change) return "ticker_red";
        else if(this.tickerEphyr.daily_change === this.prev_ticker_ephyr.daily_change) return "ticker_yellow";
        return "ticker_green";
      }
      return "ticker_green";
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  width: 100%;
}

.subBtn {
  margin-left: 865px;
  margin-top: 50px;
}

.imgContainer {
  width: 700px;
  height: 140px;
  margin-left: 250px;
  margin-top: 50px;
  background-image: url(https://en.bitcoin.it/w/images/en/c/cb/BC_Logotype.png);
  background-repeat: no-repeat;
}

.footerContainer {
  margin-top: 50px;
  color: #fff;
  background-color: #C3073F;
}

.follow {
  margin-left: 200px;
}

.follows {
  display: inline;
}

.icon {
  background-color: #950740;
  display: inline;
}

.icon a {
  color: #fff;
}

.icon:hover {
  border: 2px #de2b24 solid;
  cursor: pointer;
}

.specialIcon {
  margin-left: 600px;
}

.infoContainer {
  color: #4E4E50;;
}

.ticker_red,.disconnected {
  color: rgb(226, 33, 33);
}

.ticker_green,.connected {
  color: rgb(27, 233, 37);
}

.ticker_yellow {
  color: rgb(236, 240, 42);
}

.nameText {
  color: #fff;
}

body {
  background-color: #1A1A1D;
}
</style>
