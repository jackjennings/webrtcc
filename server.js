const hypercore = require("hypercore");
const pump = require("pump");
const signalhub = require("signalhub");
const SimplePeer = require("simple-peer");
const webrtcSwarm = require("webrtc-swarm");
const wrtc = require("wrtc");

const hubUrls = ["http://localhost:8000"];
const feed = hypercore("./storage");

feed.on("ready", () => {
  console.log(feed.key.toString('hex'));

  const append = feed.createWriteStream();
  const hub = signalhub(feed.discoveryKey.toString("hex"), hubUrls);
  const swarm = webrtcSwarm(hub, { wrtc });

  process.stdin.resume();
  // pump(process.stdin, append);

  // swarm.on("connect", (peer, id) => {
  //   console.log("connected to: ", id);
  //   pump(peer, feed.replicate({ live: true }), peer, err => console.error(err));
  // });
});
