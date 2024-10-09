#!/bin/bash

aws ec2 authorize-security-group-ingress --group-id $AWS_PROD_SG --ip-permissions IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges='[{CidrIp=0.0.0.0/0}]'

/usr/local/bin/docker-compose -f docker-compose-prod.yml run --rm certbot renew

aws ec2 revoke-security-group-ingress --group-id $AWS_PROD_SG --ip-permissions IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges='[{CidrIp=0.0.0.0/0}]'