import DDNS from './ddns.js';
import publicIp from 'public-ip';

const handler = async () => {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('you must pass in at least two args. name and hostedZoneId\nEx: npm run ddns *.example.com,*.example2.com <HOSTED_ZONE_ID>')
    return;
  }
  const names = args[0].split(',');
  const hostedZoneId = args[1];
  const enableIpv6 = args.indexOf('ipv6') !== -1;
  console.log(enableIpv6);
  const ddns = new DDNS();
  let ipv4;
  let ipv6;
  try {
    ipv4 = await publicIp.v4();
    console.log(`ipv4 is ${ipv4}`);
  } catch(e) {
    console.log("no ip v4 detected. ignoring");
  }
  if (enableIpv6) {
    try {
      ipv6 = await publicIp.v6({timeout: 1000});
      console.log(`ipv6 is ${ipv6}`);
    } catch(e) {
      console.log("no ip v6 detected. ignoring");
    }
  }
  names.forEach(async (name) => {
    if (ipv4)
      ddns.update(hostedZoneId, name, "A", ipv4);
    if (ipv6)
      ddns.update(hostedZoneId, name, "AAAA", ipv6);
  });
};

handler();
