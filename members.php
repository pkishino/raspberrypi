<?php
$cmd = $_REQUEST['cmd'];
if(isset($_REQUEST['name'])){
    $name = $_REQUEST['name'];
}
else{
    $name = '';
}
if(isset($_REQUEST['address'])){
   $address = $_REQUEST['address'];
}
else{
   $address = '';
}
$arguments= 
$command = escapeshellcmd('/home/pi/cil/member_manager.py ');
$output = shell_exec($command.escapeshellarg($cmd)." ".escapeshellarg($name). " ".escapeshellarg($address));
echo substr($output, strpos($output, ']'));
?>