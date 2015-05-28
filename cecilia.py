#!/usr/bin/env python
import sys
import datetime
import os
import runner
from collections import namedtuple
import scheduler

Item = namedtuple('Item', 'day time repeat text')
cecilia_file = 'cecilia.txt'


def say(text):
    logger.info(text)
    status = os.system('/usr/bin/say "{0}" \
        > /tmp/cecilia-say.log 2>&1'.format(text))
    logger.info(status)


def read_file(filepath):
    entries = []
    try:
        with open(filepath, 'r') as file_line:
            for entry in file_line.read().splitlines():
                if '//' not in entry:
                    day, time, repeat, text = entry.split(',')
                    item = Item(day, time, repeat, text)
                    logger.info('Read text:{}'.format(item))
                    entries.append(item)
        return entries
    except IOError, e:
        raise Exception(e)


def schedule_repeat(item):
    pass


def schedule_single(item):
    pass


def main():
    day = datetime.datetime.today().weekday()
    logger.info("Current Day:{0}".format(day))
    items = read_file(cecilia_file)
    for idx, item in enumerate(items):
        if item.repeat != '0':
            schedule_repeat(item)
        else:
            schedule_single(item)

    while True:
        schedule.run_pending()
        time.sleep(1)


if __name__ == "__main__":
    runner.setup_log('cecilia-say')
    logger = runner.get_logger()
    try:
        sys.exit(runner.run(main))
    except Exception, e:
        logger.info(e)
        sys.exit(1)
