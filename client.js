const hypercore = require("hypercore");
const PromiseQueue = require("p-queue");
const pump = require("pump");
const ram = require("random-access-memory");
const signalhub = require("signalhub");
const SimplePeer = require("simple-peer");
const webrtcSwarm = require("webrtc-swarm");

const videoMimeType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
const hubUrls = ["https://api.signal.sistercitynyc.com"];
const key = window.location.search.substring(1);

const feed = hypercore(ram, key);
const queue = new PromiseQueue({ concurrency: 1 });
const myMediaSource = new MediaSource();
const url = URL.createObjectURL(myMediaSource);

feed.on("ready", () => {
  console.log("Connecting to:", feed.key.toString("hex"));

  const hub = signalhub(feed.discoveryKey.toString("hex"), hubUrls);
  const swarm = webrtcSwarm(hub);

  swarm.on("peer", conn => {
    pump(conn, feed.replicate({ live: true }), conn, console.error);
  });
});

myMediaSource.addEventListener("sourceopen", () => {
  const videoSourceBuffer = myMediaSource.addSourceBuffer(videoMimeType);

  const read = feed.createReadStream({
    live: true
  });

  read.on("data", buffer => {
    queue.add(
      () =>
        new Promise((resolve, reject) => {
          const onUpdate = () => {
            videoSourceBuffer.removeEventListener("updateend", onUpdate);
            resolve();
          };
          videoSourceBuffer.addEventListener("updateend", onUpdate);
          videoSourceBuffer.appendBuffer(buffer);
        })
    );
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const videoTag = document.getElementById("my-video");

  videoTag.src = url;
});
