#!/bin/bash
chmod 400 sapiekeypair.pem
ssh -i "sapiekeypair.pem" ec2-user@ec2-34-209-86-220.us-west-2.compute.amazonaws.com