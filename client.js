const signalhub = require("signalhub");
const SimplePeer = require("simple-peer");
const webrtcSwarm = require("webrtc-swarm");

const hub = signalhub("asdf", ["http://localhost:8080"]);
const swarm = webrtcSwarm(hub);

swarm.on("peer", (peer, id) => {
  console.log(id);
  peer.on("data", data => console.log(data))
});
