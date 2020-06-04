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

  async update(hostedZoneId, name, type, value) {
    const lastValue = this.history.getLastRecordValue(hostedZoneId, name, type);

    if (lastValue === value) {
      console.log(`${hostedZoneId} ${name} ${type} ${value} unchanged. Doing nothing`);
      return;
    }

    try {
      await this.doUpdateRecord(hostedZoneId, name, type, value);
      this.history.setLastRecordValue(hostedZoneId, name, type, value);
      console.log(`${hostedZoneId} ${name} ${type} set to ${value}`);
    } catch (e) {
      console.error(e);
    }
  }

  async doUpdateRecord(hostedZoneId, name, type, value) {
    const params = {
      ChangeBatch: {
        Changes: [
          {
            Action: "UPSERT",
            ResourceRecordSet: {
              Name: name,
              ResourceRecords: [
                {
                  Value: value
                }
              ],
              TTL: 60,
              Type: type
            }
          }
        ],
        Comment: 'Synolgy sub-domain'
      },
      HostedZoneId: hostedZoneId
    };
  
    return route53.changeResourceRecordSets(params).promise();
  }
}
