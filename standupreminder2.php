<html>
<body>

Welcome <?php 
echo $_GET["Email"];
$lines = file("/var/www/toiletsite/logs/notif.txt");
$result = '';
foreach($lines as $line) {
	$words = explode(",", $line);
    echo trim($words[4]);
    echo trim($_GET["Email"]);
    if(trim($words[4]) == trim($_GET["Email"])) {

        $result .= $words[0] .','.$words[1].','. $words[2].','.'off,'.$_GET["Email"]."\n";

    } else {
        $result .= $line;
    }

}
file_put_contents('/var/www/toiletsite/logs/notif.txt', $result);
?>
</body>
</html>