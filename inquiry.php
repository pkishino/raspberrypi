<?php

$command = escapeshellcmd('/home/pi/cil/inquiry.py');
$output = shell_exec($command);
if (strpos($output, 'Error') !== false) {
    http_response_code(500);
}
echo $output;
