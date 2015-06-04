<html>
<body>

Welcome <?php 
echo $_GET["Email"];
$lines = file("/var/www/toiletsite/logs/notif.txt");
$word = 'word';
$result = '';
$flag = False;
foreach($lines as $line) {
	$words = explode(",", $line);
    if(trim($words[4]) == trim($_GET["Email"])) {
        $result .= $_GET["Starttime"].",".$_GET["Stoptime"].",".$_GET["Interval"].",on,".$_GET["Email"]."\n";
        $flag = True;
    } else {
        $result .= $line;
    }
}
file_put_contents('/var/www/toiletsite/logs/notif.txt', $result);
 $s=$flag ? 'true' : 'false';
if ($s=='false'){
file_put_contents('file.txt', $result); 
$myfile = fopen("/var/www/toiletsite/logs/notif.txt", "a") or die("Unable to open file!");
$txt = $_GET["Starttime"].",".$_GET["Stoptime"].",".$_GET["Interval"].",on,". $_GET["Email"]."\n" ;
fwrite($myfile, $txt);
fclose($myfile);}?>
</body>
</html>