const hypercore = require("hypercore");
const pump = require("pump");
const signalhub = require("signalhub");
const SimplePeer = require("simple-peer");
const webrtcSwarm = require("webrtc-swarm");
const wrtc = require("wrtc");

const feed = hypercore("./storage", { valueEncoding: "utf-8" });

const hub = signalhub("asdf", ["http://localhost:8080"]);
const swarm = webrtcSwarm(hub, { wrtc });

const capturePeer = (peer, id) => ({ peer, id });
const connect = K.fromEvents(swarm, "peer", capturePeer);

setInterval(() => {
  feed.append('hello');
}, 1000);

swarm.on("connect", (peer, id) => {
  console.log("connected to:", id);
  pump(peer, feed.replicate({ live: true }), peer);
});

hub.subscribe("all").on("data", data => {
  if (swarm.me !== data.from) {
    const data = swarm.wrap({ type: "connect", from: swarm.me }, "all");
    hub.broadcast("all", data);
  }
});
