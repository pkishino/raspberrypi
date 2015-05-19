#!/usr/bin/env python

import sys
import sqlite3


def last_seen(name, conn, cur):
    statement = "select time from person_status where name = '{0}' \
                 order by time desc limit 1".format(name)
    cur.execute(statement)
    for row in cur.fetchall():
        print row[0]


def fetch_team(conn, cur):
    statement = "select name from person_address"
    cur.execute(statement)
    for row in cur.fetchall():
        print row[0] + ';'


def insert_member(name, address, conn, cur):
    statement = "insert into person_address values ('{0}', '{1}');"
    cur.execute(statement.format(address, name))
    conn.commit()
    print "Added new member:{0},{1}".format(name, address)


def remove_member(name, conn, cur):
    statement = "delete from person_address where name = '{0}';"
    cur.execute(statement.format(name))
    conn.commit()
    print "Remove member:{0}".format(name)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "Error"
    elif len(sys.argv) > 4:
        print "Error"
    try:
        conn = sqlite3.connect('/home/pi/cil/whoishome.sqlite')
        cur = conn.cursor()
    except sqlite3.Error, e:
        print "SQL error: {0}".format(e)
    cmd = sys.argv[1]
    if 'insert' in cmd:
        insert_member(sys.argv[2], sys.argv[3], conn, cur)
    elif 'remove' in cmd:
        remove_member(sys.argv[2], conn, cur)
    elif 'fetchall' in cmd:
        fetch_team(conn, cur)
    elif 'seen' in cmd:
        last_seen(sys.argv[2], conn, cur)
