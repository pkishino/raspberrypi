<?php
// Tell browsers not to cache the file output so we can count all hits
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$rotatortext = '/home/pi/cil/sites.txt';
if (!file_exists($rotatortext)) {
    die('ERROR: rotatortext file not found.');
}
if (isset($_REQUEST['cmd'])) {
    $cmd = $_REQUEST['cmd'];
    $refresh = $_REQUEST['refresh'];
    if ($refresh == 'true'){
        $refresh = 'yes';
    }else{
        $refresh = 'no';
    }
    $url = $_REQUEST['url'];

    if ($fp = @fopen($rotatortext, 'r+')) {
        $locked = flock($fp, LOCK_EX);

        // Lock successful?
        if ($locked) {
            echo "Updating file now with: " . $url;
            if ($cmd == 'save') {
                $save = $refresh . ',' . $url . "\n";
                echo $save;
                if (isset($_REQUEST['old_refresh'])) {
                    $old_refresh = $_REQUEST['old_refresh'];
                    if ($old_refresh == 'true'){
                        $old_refresh = 'yes';
                    }else{
                        $old_refresh = 'no';
                    }
                    $old_url = $_REQUEST['old_url'];
                    $contents = file_get_contents($rotatortext);
                    $quote = preg_quote($old_refresh . ',' . $old_url, '/');
                    echo $quote;
                    $contents = preg_replace('/^.*?' . $quote . '.*\n?/m', $save, $contents);
                    file_put_contents($rotatortext, $contents);
                } else {
                    file_put_contents($rotatortext, $save, FILE_APPEND);
                }
            } elseif ($cmd == 'delete') {
                $contents = file_get_contents($rotatortext);
                $quote = preg_quote($refresh . ',' . $url, '/');
                echo $quote;
                $contents = preg_replace('/^.*?' . $quote . '.*\n?/m', '', $contents);
                echo $contents;
                file_put_contents($rotatortext, $contents);
            }
        } else {
            echo "Read error, file locked";
        }

        // Release file lock and close file handle
        flock($fp, LOCK_UN);
        fclose($fp);
        exit();
    } else {
        die("ERROR: <b>Not writable.</b> PHP needs permission to write to file $rotatortext");
    }
} else {
    foreach (file($rotatortext) as $line) {
        if (trim($line[0]) !== '') {
            echo $line;
        }
    }
    exit();
}
