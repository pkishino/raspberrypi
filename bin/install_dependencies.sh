#!/usr/bin/env bash

echo "You'll be asked for your password since you're about to install some packages that the notifier depends on."
export http_proxy=www-proxy.ericsson.se:8080

sudo apt-get --assume-yes --quiet install python-gtk2
sudo apt-get --assume-yes --quiet install python-pip
sudo apt-get --assume-yes --quiet install python-dev
sudo apt-get --assume-yes --quiet install libevent-dev
sudo apt-get --assume-yes --quiet install python-appindicator
sudo pip -q install py-notify


