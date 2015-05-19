#!/usr/bin/python -Btt
import logging
import logging.config
import ConfigParser
import os

here = os.path.dirname(os.path.realpath(__file__))


def get_logger(logclass=None):
    return logging.getLogger(logclass)


def delete_config():
    if os.path.isfile(log_path):
        os.remove(log_path)
    print 'Script logging stopped for :{0}'.format(log_path)


def setup_logger(path):
    log_conf_path = os.path.join(here, 'logging.conf')
    existing_conf = os.path.join('/tmp', '{0}.conf'.format(path))

    if os.path.isfile(existing_conf):
        logging.config.fileConfig(existing_conf)
        logger = get_logger()
        logger.debug('Log re-initialized and continuing')
    else:
        log_path = os.path.join('/tmp', '{0}.log'.format(path))
        logging.config.fileConfig(log_conf_path, defaults={'logfilename': '{0}'
                                                           .format(log_path)})
        config = ConfigParser.ConfigParser()
        config.read(log_conf_path)
        config.set('DEFAULT', 'logfilename', '{0}'.format(log_path))
        with open(existing_conf, 'w+') as configfile:
            config.write(configfile)
        logger = get_logger()
        logger.debug('Log initialized and starting in:{0}'.format(log_path))
        print 'Script logging started in :{0}'.format(log_path)

    logger.debug('Existing conf at:{0}'.format(existing_conf))
