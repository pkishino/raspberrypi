#!/usr/bin/env python

# file: inquiry.py
# auth: Albert Huang <albert@csail.mit.edu>
# desc: performs a simple device inquiry followed by a remote name request of
#       each discovered device
# $Id: inquiry.py 401 2006-05-05 19:07:48Z albert $
#

import bluetooth
try:
    nearby_devices = bluetooth.discover_devices(lookup_names=True)

    for idx, device in enumerate(nearby_devices):
        print ("{0}, {1}".format(device[0], device[1]))
except bluetooth.btcommon.BluetoothError, e:
    print "Error, could not communicate with bluetooth"
