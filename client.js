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
  console.log("connected to: ", id);
  if (id !== swarm.me) {
    pump(peer, feed.replicate({ live: true }), peer);
  }
});

// None of these ever log…

feed.on("append", () => console.log("appended"));
feed.on("append", (index, data) => console.log("downloaded", data));
feed.on("error", e => console.log(e));

const stream = feed.createReadStream({
  live: true,
  tail: true
});

stream.on("data", d => console.log(d));

setInterval(() => {
  console.log("Length: ", feed.length)
  feed.head(d => console.log("Head: ", d));
}, 1000);
