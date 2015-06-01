<?php

$ceciliatext = '/home/pi/cil/cecilia.txt';

// Does the log file exist?
if ( ! file_exists($ceciliatext) )
{
    die('ERROR: ceciliatext file not found.');
}

foreach(file($ceciliatext) as $line) {
    if (strpos($line,'//') === false){
        echo $line;
    }
}
?>
