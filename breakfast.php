<?php

$breakfastfile = 'logs/breakfast.txt';

// Does the log file exist?
if (!file_exists($breakfastfile)) {
    die('ERROR: breakfast file not found.');
}

foreach (file($breakfastfile) as $line) {
    echo $line;
}
