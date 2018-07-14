const pump = require("pump");
const signalhub = require("signalhub");
const SimplePeer = require("simple-peer");
const webrtcSwarm = require("webrtc-swarm");

const hypercore = require("hypercore");
const ram = require("random-access-memory");

const feed = hypercore(() => ram(), { valueEncoding: "utf-8" });

const hub = signalhub("asdf", ["http://localhost:8080"]);
const swarm = webrtcSwarm(hub);

swarm.on("peer", (peer, id) => {
  if (id !== swarm.me) {
    pump(peer, feed.replicate({ live: true }), peer);
  }
});

feed.on("append", console.log.bind(console));
