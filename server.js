const hypercore = require("hypercore");
const pump = require("pump");
const signalhub = require("signalhub");
const SimplePeer = require("simple-peer");
const webrtcSwarm = require("webrtc-swarm");
const wrtc = require("wrtc");

const feed = hypercore("./storage", { valueEncoding: "utf-8" });

const hub = signalhub("asdf", ["http://localhost:8080"]);
const swarm = webrtcSwarm(hub, { wrtc });

swarm.on("connect", (peer, id) => {
  console.log("connected to: ", id);
  pump(peer, feed.replicate({ live: true }), peer);
});

setInterval(() => {
  console.log("append");
  feed.append("hello");
}, 1000);
