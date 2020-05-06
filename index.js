import DDNS from './ddns.js';
import publicIp from 'public-ip';

const handler = async () => {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.error('you must pass in exactly two args. name and hostedZoneId\nEx: npm run ddns *.example.com <HOSTED_ZONE_ID>')
    return;
  }
  const name = args[0]
  const hostedZoneId = args[1];
  const ddns = new DDNS();
  ddns.update(name, hostedZoneId, await publicIp.v4());
};

handler();
