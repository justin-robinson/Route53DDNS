import History from './history.js';
import AWS from 'aws-sdk';
import path from 'path';

AWS.config.apiVersions = {
  route53: '2013-04-01'
};
const route53 = new AWS.Route53();

export default class DDNS {

  constructor() {
    this.history = new History(path.join(process.cwd(), 'history'));
  }

  async update(name, hostedZoneId, ip) {
    const lastIP = this.history.getLastIP(name, hostedZoneId);

    if (lastIP === ip) {
      console.log('ip unchanged. doing nothing');
      return;
    }

    try {
      await this.doUpdate(name, hostedZoneId, ip);
      this.history.setLastIP(name, hostedZoneId, ip);
      console.log(`${name} set to ${ip}`);
    } catch (e) {
      console.error(e);
    }
  }

  async doUpdate(name, hostedZoneId, ip) {
    const params = {
      ChangeBatch: {
        Changes: [
          {
            Action: "UPSERT",
            ResourceRecordSet: {
              Name: name,
              ResourceRecords: [
                {
                  Value: ip
                }
              ],
              TTL: 60,
              Type: "A"
            }
          }
        ],
        Comment: 'Synolgy sub-domain'
      },
      HostedZoneId: hostedZoneId
    };
  
    await route53.changeResourceRecordSets(params).promise();
  }
}
