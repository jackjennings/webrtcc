const signalhub = require("signalhub");
const SimplePeer = require("simple-peer");
const wrtc = require("wrtc");
const webrtcSwarm = require("webrtc-swarm");
const K = require("kefir");

const hub = signalhub("asdf", ["http://localhost:8080"]);
const swarm = webrtcSwarm(hub, { wrtc });

const connect = K.fromEvents(swarm, "peer", (peer, id) => [peer, id]);

connect.observe(([peer, id]) => {
  console.log(swarm.peers.length);
  console.log(id);
  peer.send(`hey ${id}`);
});
