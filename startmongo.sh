#!/bin/sh
sudo mongod --bind_ip=$IP --dbpath=/home/ubuntu/workspace/data --nojournal --smallfiles --rest "$@" &
