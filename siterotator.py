#!/usr/bin/env python
import sys
import time
import runner
import subprocess
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

linkfile = '/home/pi/cil/sites.txt'
sites = []
i = 0
class MyHandler(PatternMatchingEventHandler):
    def on_modified(self, event):
        logger.info(event.src_path)
        if linkfile in event.src_path:
            setup_sites()


def read_file(filepath):
    entries = []
    with open(filepath, 'r') as file_line:
        for entry in file_line.read().splitlines():
            refresh = 'no'
            if ',' in entry:
                refresh, value = entry.split(',')
            else:
                value = entry
            if entry != '':
                entries.append((value, refresh))
    return entries


def setup_sites():
    global sites
    global i
    new_sites = read_file(linkfile)
    logger.debug(new_sites)
    diff = set(new_sites).difference(sites)
    logger.debug(diff)
    sites = new_sites
    logger.info('found new sites, will recreate')
    logger.debug(sites)
    subprocess.call(
        ["killall", "-TERM", "chromium"])
    time.sleep(2)
    subprocess.call(
        ["killall", "-9", "chromium"])
    for idx, site in enumerate(sites,start=0):
        logger.info("creating:" + site[0])
        subprocess.Popen(
            ["chromium", "--kiosk", "{0}"
                .format(site[0])])
        i = idx
        logger.info("sitenumber:%s" % i)
        time.sleep(10)
    i += 1


def run_rotate():
    global i
    while True:
        logger.info("Sites:%d index:%d" % (len(sites), i))
        if i == len(sites):
            logger.info("reached max,back to 0")
            i = 0
        logger.info("Changing tab")
        subprocess.call(["xdotool", "key", "ctrl+Tab"])
        subprocess.call(["notify-send", "Page %d of %d" % (i, len(sites))])
        logger.info("sitenumber:%d" % i)
        if 'yes' in sites[i][1]:
            logger.info("refreshing")
            subprocess.call(["xdotool", "key", "ctrl+r"])
        i += 1
        time.sleep(60)


def main():
    event_handler = MyHandler(patterns=[linkfile])
    observer = Observer()
    observer.schedule(event_handler, path='/home/pi/cil', recursive=True)
    observer.start()
    setup_sites()
    run_rotate()
    observer.join()


if __name__ == "__main__":
    runner.setup_log('rotator')
    logger = runner.get_logger()
    try:
        sys.exit(runner.run(main))
    except Exception, e:
        logger.info(e)
        sys.exit(1)
