<?php
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
$breakfastfile = 'breakfast.txt';

// Does the log file exist?
if (!file_exists($breakfastfile)) {
    http_response_code(500);
    die('ERROR: breakfast file not found.');
}

foreach (file($breakfastfile) as $line) {
    echo $line;
}
