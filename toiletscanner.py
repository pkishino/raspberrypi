#!/usr/bin/env python
import sys
import sqlite3
from time import sleep
import RPi.GPIO as GPIO

import runner


def main():
    GPIO.setmode(GPIO.BCM)
    # Setup an input
    GPIO.setup(22, GPIO.IN)
    GPIO.input(22)
    # Returns true or false

    # Setup another input
    GPIO.setup(23, GPIO.IN)
    GPIO.input(23)

    try:
        conn = sqlite3.connect('/var/www/toiletsite/toilet.sqlite')
        cur = conn.cursor()
    except sqlite3.Error, e:
        logger.error(e)

    statement = "insert into toilet_data values ({0}, CURRENT_TIMESTAMP, {1});"
    t1_last_state = 2
    t2_last_state = 2

    while True:
        logger.info('Sleeping')
        sleep(1)
        if t1_last_state != GPIO.input(22):
            t1_last_state = GPIO.input(22)
            cur.execute(statement.format(1, t1_last_state))
            conn.commit()
            logger.info("Toilet 1 light changed")

        if t2_last_state != GPIO.input(23):
            t2_last_state = GPIO.input(23)
            cur.execute(statement.format(2, t2_last_state))
            conn.commit()
            logger.info("Toilet 2 light changed")


if __name__ == "__main__":
    runner.setup_log('toilet-scanner')
    logger = runner.get_logger()
    try:
        sys.exit(runner.run(main))
    except Exception, e:
        logger.info(e)
        sys.exit(1)
