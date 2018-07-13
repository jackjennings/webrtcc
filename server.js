const signalhub = require("signalhub");
const SimplePeer = require("simple-peer");
const wrtc = require("wrtc");
const K = require("kefir");

const hub = signalhub("asdf", ["http://localhost:8080"]);
const offer = hub.subscribe("call");
const message = K.fromEvents(offer, "data");

const peer = new SimplePeer({ wrtc });
const signal = K.fromEvents(peer, "signal");
const connect = K.fromEvents(peer, "connect");
const data = K.fromEvents(peer, "data");
const close = K.fromEvents(peer, "close");

message.observe(({ offer, id }) => {
  peer.signal(offer);
});

signal.observe(offer => {
  hub.broadcast("answer", { offer });
});

connect.log("connected");
data.log();

connect.observe(() => {
  setTimeout(() => peer.send("hey"), 1000)
});
