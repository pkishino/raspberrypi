#!/usr/bin/env python

import sys
import sqlite3
import os
import runner


def main():
    if len(sys.argv) < 2:
        print "Error"
        logger.info("Error")
    elif len(sys.argv) > 4:
        logger.info("Error")
        print "Error"
    try:
        conn = sqlite3.connect('/home/pi/cil/whoishome.sqlite')
        cur = conn.cursor()
    except sqlite3.Error, e:
        logger.info("SQL error: {0}".format(e))
    cmd = sys.argv[1]
    if 'insert' in cmd:
        insert_member(sys.argv[2], sys.argv[3], conn, cur)
    elif 'remove' in cmd:
        remove_member(sys.argv[2], conn, cur)
    elif 'fetchall' in cmd:
        fetch_team(conn, cur)
    elif 'seen' in cmd:
        last_seen(sys.argv[2], conn, cur)
    elif 'say' in cmd:
        say(sys.argv[2])


def last_seen(name, conn, cur):
    statement = "select time from person_status where name = '{0}' \
                 order by time desc limit 1".format(name)
    cur.execute(statement)
    values = cur.fetchall()
    if len(values) == 0:
        print 'never'
        logger.info(name+':never')
    for row in values:
        print row[0]
        logger.info(name+':'+row[0])


def fetch_team(conn, cur):
    statement = "select name from person_address"
    cur.execute(statement)
    for row in cur.fetchall():
        print row[0] + ';'
        logger.info(row[0] + ';')


def insert_member(name, address, conn, cur):
    statement = "insert into person_address values ('{0}', '{1}');"
    cur.execute(statement.format(address, name))
    conn.commit()
    logger.info("Added new member:{0},{1}".format(name, address))
    say("Welcome to the team {0}, I will now keep an \
     eye out for you".format(name))


def say(text):
    logger.info(text)
    status = os.system('/usr/bin/say "{0}" \
        > /tmp/member-manager.log 2>&1'.format(text))
    logger.info(status)


def remove_member(name, conn, cur):
    statement = "delete from person_address where name = '{0}';"
    cur.execute(statement.format(name))
    conn.commit()
    logger.info("Remove member:{0}".format(name))
    say("Goodbye {0}, I will miss you".format(name))

if __name__ == "__main__":
    runner.setup_log('member-manager')
    logger = runner.get_logger()
    try:
        sys.exit(runner.run(main))
    except Exception, e:
        logger.info(e)
        sys.exit(1)
