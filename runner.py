#!/usr/bin/python -Btt
import configure_logging


def setup_log(path):
    configure_logging.setup_logger(path)


def get_logger():
    logger = configure_logging.get_logger('root')
    logger.debug('{0} logger setup'.format('root'))
    return logger


def delete_log_config():
    configure_logging.delete_config()


def run(method):
    method()
    return 0
