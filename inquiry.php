<?php 

$command = escapeshellcmd('/home/pi/cil/inquiry.py');
$output = shell_exec($command);
echo $output;

?>