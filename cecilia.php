<?php
include 'utils.php';
// Tell browsers not to cache the file output so we can count all hits
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$ceciliatext = '/home/pi/cil/cecilia.txt';
if (!file_exists($ceciliatext)) {
    die('ERROR: ceciliatext file not found.');
}
if (isset($_REQUEST['cmd'])) {
    $cmd = $_REQUEST['cmd'];
    $day = $_REQUEST['day'];
    $time = $_REQUEST['time'];
    $repeat = $_REQUEST['repeat'];
    $text = $_REQUEST['text'];

    if ($fp = @fopen($ceciliatext, 'r+')) {
        $locked = flock($fp, LOCK_EX);

        // Lock successful?
        if ($locked) {
            echo "Updating file now with: " . $text;
            if ($cmd == 'save') {
                $save = $day . ' ' . $time . ' ' . $repeat . ' "' . $text . '"' . "\n";
                echo $save;
                if (isset($_REQUEST['old_day'])) {
                    $old_day = $_REQUEST['old_day'];
                    $old_time = $_REQUEST['old_time'];
                    $old_repeat = $_REQUEST['old_repeat'];
                    $old_text = $_REQUEST['old_text'];
                    $contents = file_get_contents($ceciliatext);
                    $quote = preg_quote($old_day . ' ' . $old_time . ' ' . $old_repeat .
                        ' "' . $old_text . '"');
                    echo $quote;
                    $contents = preg_replace('/^.*?' . $quote . '.*\n?/m', $save, $contents);
                    file_put_contents($ceciliatext, $contents);
                } else {
                    file_put_contents($ceciliatext, $save, FILE_APPEND);
                }
            } elseif ($cmd == 'delete') {
                $contents = file_get_contents($ceciliatext);
                $quote = preg_quote($day . ' ' . $time . ' ' . $repeat . ' "' . $text . '"', '/');
                echo $quote;
                $contents = preg_replace('/^.*?' . $quote . '.*\n?/m', '', $contents);
                echo $contents;
                file_put_contents($ceciliatext, $contents);
            }
        } else {
            echo "Read error, file locked";
        }

        // Release file lock and close file handle
        flock($fp, LOCK_UN);
        fclose($fp);
    } else {
        die("ERROR: <b>Not writable.</b> PHP needs permission to write to file $ceciliatext");
    }
} else {
    foreach (file($ceciliatext) as $line) {
        if (startsWith($line, '//') === false && trim($line[0]) !== '') {
            echo $line;
        }
    }
}
