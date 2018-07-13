const signalhub = require("signalhub");
const SimplePeer = require("simple-peer");
const wrtc = require("wrtc");

const id = "asdf1234";

const peer = new SimplePeer({ wrtc, initiator: true });

const hub = signalhub("asdf", ["http://localhost:8080"]);
const answer = hub.subscribe("answer");

peer.on("signal", offer => {
  hub.broadcast("call", { offer, id });
});

peer.on("connect", () => {
  console.log("connected");
});

peer.on("data", data => {
  console.log(data);
})

answer.on("data", ({ offer }) => {
  peer.signal(offer);
});
