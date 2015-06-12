#!/usr/bin/env python
# -*- coding: latin-1 -*-
from ConfigParser import ConfigParser
from collections import namedtuple
import os
import socket
import random
import urllib2
import appindicator
import pynotify
import gtk
import gobject
import json


# PIP dependencies: py-notify, pygtk, appindicator,
# apt dependencies: python-dev, libev

AVAILABLE=0
BUSY=1
UNKNOWN=-1

Config = namedtuple('Config', ['sleep_time', 'resource_dir', 'server_url', 'http_timeout'])

RESOURCES_DIR=os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir, 'icons'))
DEFAULT_CONFIG = Config(sleep_time=2,
                        resource_dir=RESOURCES_DIR,
                        server_url='http://cil-web/views/toilets/toiletdata.php',
                        http_timeout=3)

def no_proxy():
    urllib2.install_opener(
        urllib2.build_opener(
            urllib2.ProxyHandler({})
        )
    )

def get_config():
    '''
    Gets configuration from a config file.
    The file should be located in the user home directory and named .rpee

    Example configuration file contents:
    [rpee]
    server_url=http://136.225.5.101/toiletdata.php
    sleep_time=2
    resource_dir=/home/epkmann/PycharmProjects/loo_notify/src/resources

    :return: a namedtuple with member names matching those in the example configuration file above.
    '''
    if os.path.exists(os.path.expanduser('~/.rpee')):
        config = ConfigParser()
        config.read(os.path.expanduser('~/.rpee'))
        sleep_time = config.getint('rpee', 'sleep_time')
        resource_dir = config.get('rpee', 'resource_dir')
        server_url = config.get('rpee', 'server_url')
        http_timeout = config.getint('rpee', 'http_timeout')
        return Config(sleep_time=sleep_time,
                      resource_dir=resource_dir,
                      server_url=server_url,
                      http_timeout=http_timeout)
    else:
        return DEFAULT_CONFIG

def get_notification_message():
    '''
    Returns a random message for notification when a toilet becomes available.
    :return:
    '''
    icon=os.path.join(get_config().resource_dir, 'green2.png')
    possible_messages = [
        ['You better run', "It'll be busy again in a second", icon ],
        ['Your lavatory is ready for you, sire', 'Seize the moment before someone else does', icon],
    ]
    return random.choice(possible_messages)


class StatusMonitor(object):
    def __init__(self):
        self.config = get_config()
        self.working = False
        self.watching = False
        self.state = UNKNOWN

        self.app_indicator = appindicator.Indicator('toilets', os.path.join(RESOURCES_DIR, 'grey.png'),
                                                    appindicator.CATEGORY_APPLICATION_STATUS)
        self.app_indicator.set_status(appindicator.STATUS_ACTIVE)
        m = gtk.Menu()
        ci = gtk.MenuItem('Watch')
        qi = gtk.MenuItem('Quit')

        ci.connect('activate', self.activate_watch)
        qi.connect('activate', quit_notifier)

        m.append(ci)
        m.append(qi)

        self.app_indicator.set_menu(m)
        ci.show()
        qi.show()

        pynotify.init("Toiletries")

        self.update()

    def setup_menu(self):
        pass

    def check_status(self, _):

        try:
            if self.working:  # some sort of poor mans load regulation...
                return
            self.working = True
            try:
                htmltext = urllib2.urlopen(self.config.server_url, timeout=self.config.http_timeout).readlines()
            except (socket.timeout, socket.error, urllib2.URLError), _:
                self.app_indicator.set_icon(os.path.join(self.config.resource_dir, 'grey2.png'))
                self.state = UNKNOWN
                return

            data = json.loads(htmltext[0])

            # print data
            new_state = AVAILABLE if any(x == 0 for x in data.values()) else BUSY
            if new_state == AVAILABLE:
                self.app_indicator.set_icon(os.path.join(self.config.resource_dir, 'green2.png'))
            else:
                self.app_indicator.set_icon(os.path.join(self.config.resource_dir, 'red2.png'))

            # print "new_state = {}, watching = {}, old_state = {}".format(new_state, self.watching, self.state)
            if new_state == AVAILABLE and self.watching:
                notice = pynotify.Notification(*get_notification_message())
                notice.set_urgency(pynotify.URGENCY_CRITICAL)
                notice.show()
                self.watching = False
            self.state = new_state
        finally:
            self.working = False
            gobject.timeout_add_seconds(self.config.sleep_time, self.update)

    def update(self):
        self.check_status(None)
        return False

    def activate_watch(self, _):
        if self.state == BUSY:
            self.watching = True
        else:
            notice = pynotify.Notification('Just go, man!', 
                                           'There are toilets free, no need to wait', 
                                            os.path.join(self.config.resource_dir, 'green2.png'))
            notice.set_urgency(pynotify.URGENCY_CRITICAL)
            notice.show()


def quit_notifier(item):
    gtk.main_quit()

if __name__ == '__main__':
    no_proxy()
    mon = StatusMonitor()
    gtk.main()

