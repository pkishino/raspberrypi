#!/usr/bin/env python
import sys
import bluetooth
import sqlite3
from time import sleep
import runner


def main():
    try:
        conn = sqlite3.connect('/home/pi/cil/whoishome.sqlite')
        cur = conn.cursor()
    except sqlite3.Error, e:
        logger.error(e)

    insert = "insert into person_status values ('{0}'," \
        " datetime('now','localtime'));"
    fetch = 'select * from person_address;'
    while True:
        cur.execute(fetch)
        for row in cur.fetchall():
            address, name = row
            logger.info('checking:' + name)
            result = bluetooth.lookup_name(address, timeout=5)
            if result is not None:
                logger.info('result:' + result)
                cur.execute(insert.format(name))
                conn.commit()
            else:
                logger.warning('Couldnt find ' + name)
        sleep(60)

if __name__ == "__main__":
    runner.setup_log('bluetooth-scanner')
    logger = runner.get_logger()
    try:
        sys.exit(runner.run(main))
    except Exception, e:
        logger.info(e)
        sys.exit(1)
