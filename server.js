const choppa = require("choppa");
const fs = require("fs");
const hypercore = require("hypercore");
const pump = require("pump");
const signalhub = require("signalhub");
const SimplePeer = require("simple-peer");
const webrtcSwarm = require("webrtc-swarm");
const wrtc = require("wrtc");

const hubUrls = ["https://api.signal.sistercitynyc.com"];
const feed = hypercore("./storage/content", {
  overwrite: true
});

const blockSize = 16 * 1024; // 16kb

feed.on("ready", () => {
  console.log("Broadcasting from:", feed.key.toString("hex"));

  const hub = signalhub(feed.discoveryKey.toString("hex"), hubUrls);
  const sw = webrtcSwarm(hub, { wrtc });
  const content = fs.createReadStream("./test.mp4");

  const chunks = pump(content, choppa(blockSize));

  chunks.on("data", d => {
    feed.append(d);
  });

  sw.on("peer", function(conn) {
    console.log("peer");

    pump(conn, feed.replicate({ live: true }), conn, console.error);
  });
});
