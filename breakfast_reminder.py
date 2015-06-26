#!/usr/bin/env python
import sys
import datetime
from collections import namedtuple
import smtplib
from email.mime.text import MIMEText
import runner

breakfast_file = '/var/www/toiletsite/views/breakfast/breakfast.txt'
Member = namedtuple('Member', 'name week email')
server_email = 'cil-breakfast-reminder@ericsson.com'
msg = MIMEText(
    "Don't forget breakfast tomorrow, it's your turn.\n\
     If you forget there WILL be consequences")
msg['Subject'] = 'Breakfast reminder'
msg['From'] = server_email
s = smtplib.SMTP('smtp.internal.ericsson.com')


def read_file(filepath):
    entries = []
    try:
        with open(filepath, 'r') as file_line:
            for entry in file_line.read().splitlines():
                week, name, email = entry.split(',')
                member = Member(name, int(week), email)
                logger.info('Read member:{}'.format(member))
                entries.append(member)
        return entries
    except IOError, e:
        raise Exception(e)


def main():
    week = datetime.datetime.utcnow().isocalendar()[1]
    day = datetime.datetime.today().weekday()
    logger.info("Current week:{0} Day:{1}".format(week, day))
    members = read_file(breakfast_file)
    for idx, member in enumerate(members):
        if member.week == week and not day > 3:
            logger.info('Sending reminder to:{0}'.format(member.name))
            msg['To'] = member.email
            s.sendmail(server_email, member.email,
                       msg.as_string())
            s.quit()
        else:
            logger.info('Not yet :{0}'.format(member.name))


if __name__ == "__main__":
    runner.setup_log('breakfast-reminder')
    logger = runner.get_logger()
    try:
        sys.exit(runner.run(main))
    except Exception, e:
        logger.info(e)
        sys.exit(1)
