# WebRTCC

## Mac

```
ffmpeg -f avfoundation -r 30 -s "640x480" -i "0:0" -c:a aac -ab 64k -c:v libx264 -vb 448k -vsync 2 -pix_fmt yuv420p -profile:v high -f mp4 -movflags frag_keyframe+default_base_moof -reset_timestamps 1 -frag_duration 70000 - | node server.js
```

Adapted from: https://github.com/eventials/poc-mp4-websocket/blob/master/README.md

## Pi

Connection to Pi over USB: https://www.thepolyglotdeveloper.com/2016/06/connect-raspberry-pi-zero-usb-cable-ssh/

### Setting up WiFi

Following this guide: https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md

Plug in the microSD card into your computer, and in the `boot` volume, create a file called `wpa_supplicant.conf` with the new network configuration. This file will be copied to the correct location when the Pi next boots up, overwriting any previous configuration.
