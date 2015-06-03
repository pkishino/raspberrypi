#!/usr/bin/env python
import sys
import datetime
import shlex
import os
import runner
from collections import namedtuple
import schedule
import time
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

cecilia_file = '/home/pi/cil/cecilia.txt'
Item = namedtuple('Item', 'day time repeat text')


class MyHandler(PatternMatchingEventHandler):
    def on_modified(self, event):
        logger.info(event.src_path)
        if cecilia_file in event.src_path:
            setup_schedule()


def say(text):
    logger.info(text)
    if text.endswith('.mp3'):
        status = os.system('/usr/bin/say "{0}" \
        > /tmp/cecilia-say.log 2>&1'
                           .format('Listen up! Time for some wicked tunes!'))
        status = os.system('mplayer {0} > /tmp/cecilia-say.log 2>&1'
                           .format(text))
        status = os.system('/usr/bin/say "{0}" \
        > /tmp/cecilia-say.log 2>&1'
                           .format('Ok, back to work again'))
    else:
        status = os.system('/usr/bin/say "{0}" \
        > /tmp/cecilia-say.log 2>&1'.format(text))
    logger.info(status)


def read_file(filepath):
    entries = []
    try:
        with open(filepath, 'r') as file_line:
            for entry in file_line.read().splitlines():
                if not entry.startswith('//') and len(entry) > 0:
                    day, time, repeat, text = shlex.split(entry)
                    item = Item(int(day), time, repeat, text)
                    logger.info('Read text:{}'.format(item))
                    entries.append(item)
        return entries
    except IOError, e:
        raise Exception(e)


def schedule_repeat(item):
    frequency = int(item.repeat[0])
    when = item.repeat[1]
    if 'W' in when:
        schedule_day_job(item, single_say)
    elif 'D' in when:
        schedule.every(frequency).days.at(item.time).do(say, item.text)
    elif 'H' in when:
        schedule.every(frequency).hours.do(say, item.text)
    elif 'M' in when:
        schedule.every(frequency).minutes.do(say, item.text)


def single_say(text):
    say(text)
    return schedule.CancelJob


def schedule_day_job(item, job):
    if item.day == 0:
        schedule.every().monday.at(item.time).do(job, item.text)
    elif item.day == 1:
        schedule.every().tuesday.at(item.time).do(job, item.text)
    elif item.day == 2:
        schedule.every().wednesday.at(item.time).do(job, item.text)
    elif item.day == 3:
        schedule.every().thursday.at(item.time).do(job, item.text)
    elif item.day == 4:
        schedule.every().friday.at(item.time).do(job, item.text)
    elif item.day == 5:
        schedule.every().saturday.at(item.time).do(job, item.text)
    elif item.day == 6:
        schedule.every().sunday.at(item.time).do(job, item.text)


def setup_schedule():
    logger.info('Setting up new schedule')
    schedule.clear()
    day = datetime.datetime.today().weekday()
    logger.info("Current Day:{0}".format(day))
    items = read_file(cecilia_file)
    for idx, item in enumerate(items):
        if item.repeat != '0' and len(item.repeat) == 2:
            schedule_repeat(item)
        else:
            schedule_day_job(item, single_say)


def main():
    if len(sys.argv) == 2:
        logger.info('Playing single say')
        say(sys.argv[1])
    else:
        event_handler = MyHandler(patterns=[cecilia_file])
        observer = Observer()
        observer.schedule(event_handler, path='/home/pi/cil', recursive=True)
        observer.start()
        setup_schedule()
        observer.join()


if __name__ == "__main__":
    runner.setup_log('cecilia-say')
    logger = runner.get_logger()
    try:
        sys.exit(runner.run(main))
    except Exception, e:
        logger.info(e)
        sys.exit(1)
