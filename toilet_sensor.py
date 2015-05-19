#!/usr/bin/env python

import os
import sqlite3
import time
import datetime
from time import sleep
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)

# Setup an input
GPIO.setup(22, GPIO.IN)
GPIO.input(22)

# Setup another input
GPIO.setup(23, GPIO.IN)
GPIO.input(23)

try:
    conn = sqlite3.connect('/root/toilet.sqlite')
    cur = conn.cursor()
except sqlite3.Error, e:
    print e

statement = "insert into toilet_data values ({0}, CURRENT_TIMESTAMP, {1});"

t1_last_state = 2
t2_last_state = 2

while 1:
    sleep(1)
    if t1_last_state != GPIO.input(22):
        t1_last_state = GPIO.input(22)
        cur.execute(statement.format(1, t1_last_state))
        conn.commit()
        print "Toilet 1 light changed"

    if t2_last_state != GPIO.input(23):
        t2_last_state = GPIO.input(23)
        cur.execute(statement.format(2, t2_last_state))
        conn.commit()
        print "Toilet 2 light changed"
