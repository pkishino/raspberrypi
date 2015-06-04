#!/usr/bin/env python
import sys
import datetime
from collections import namedtuple
import smtplib
from email.mime.text import MIMEText
import runner
import schedule
import time
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

notif_file = '/var/www/toiletsite/logs/notif.txt'
Member = namedtuple('Member', 'starttime stoptime interval status email')
server_email = 'cil-notif-reminder@ericsson.com'
msg = MIMEText("It 's time to change your position")
msg['Subject'] = ' movement reminder'
msg['From'] = server_email
s = smtplib.SMTP('smtp.internal.ericsson.com')


class MyHandler(PatternMatchingEventHandler):
    def on_modified(self, event):
        logger.info(event.src_path)
        if cecilia_file in event.src_path:
            setup_schedule()


def read_file(filepath):
    entries = []
    try:
        with open(filepath, 'r') as file_line:
            for entry in file_line.read().splitlines():
                starttime, stoptime, interval, status, email = entry.split(',')
                member = Member(starttime, stoptime, int(interval),
                                status, email)
                entries.append(member)
        return entries
    except IOError, e:
        raise Exception(e)


def setup_schedule():
    items = []
    schedule.clear()
    items = read_file(notif_file)
    for item in items:
        schedule_repeat(item)


def schedule_repeat(item):
    time = datetime.datetime.now().time()
    starttime = datetime.datetime.strptime(item.starttime, '%H:%M').time()
    print time
    print starttime
    stoptime = datetime.datetime.strptime(item.stoptime, '%H:%M').time()
    print time > starttime
    print time > stoptime
    if(time >= starttime and time <= stoptime):
        schedule.every(item.interval).minutes.do(send_notification, item)


def send_notification(item):
    if item.status == 'on':
        msg['To'] = item.email
        s.sendmail(server_email, item.email,
                   msg.as_string())
        s.quit()


def main():
    event_handler = MyHandler(patterns=[notif_file])
    observer = Observer()
    observer.schedule(event_handler, path='/var/www/toiletsite/logs',
                      recursive=True)
    observer.start()
    setup_schedule()
    while True:
        schedule.run_pending()
        time.sleep(1)
    observer.join()


if __name__ == "__main__":
    try:
        main()
    except Exception, e:
        print e
        sys.exit(1)
