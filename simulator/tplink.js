const { Device } = require('tplink-smarthome-simulator')
const { UdpServer } = require('tplink-smarthome-simulator')

const devices = [];

// If you setup virtual interfaces or aliases you can have unique ips to work with Kasa app.
// On a mac you can run `sudo ifconfig en0 alias 10.0.0.200`
devices.push(
  new Device({
    port: 9999,
    address: '0.0.0.0',
    model: 'hs100',
    data: { alias: 'Mock HS100', mac: '50:c7:bf:8f:58:18', deviceId: 'A100' },
  }),
);

devices.forEach((d) => {
  d.start();
});

UdpServer.start();