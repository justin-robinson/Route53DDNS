# Route53DDNS

## Usage
`npm run ddns subdomain.example.com <ROUTE53_HOSTED_ZONE_ID>`

## What does it do?
Updates records for you in route53.

## Setup
1. install aws-cli and setup proper access keys for your account
1. Put a command in a cron job somewhere like this
`(cd /path/where/you/clone/this/repo/Route53DDNS && npm run ddns subdomain.example.com <ROUTE53_HOSTED_ZONE_ID>)`

## Fun to knows
1. It will create a history folder to keep track of the latest IP it set so it doesn't update records when it doesn't need it
