<?php
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
$offset = $_REQUEST['offset'];
$offset_end = $offset + 1;
if (isset($_REQUEST['id'])) {
    $id = $_REQUEST['id'];
    if ($offset >= 0) {
        $statement = "SELECT timestamp, state FROM toilet_data WHERE id = " . $id .
        " AND timestamp BETWEEN date('now','-" . $offset_end . " day') AND date
        ('now', '-" . $offset . " day') ORDER BY timestamp";
    } else {
        $statement = "SELECT timestamp, state FROM toilet_data WHERE id = " . $id .
        " AND timestamp > date('now') ORDER BY timestamp";
    }
} else {
    $statement = "SELECT timestamp, state FROM toilet_data WHERE timestamp BETWEEN
     date('now','-" . $offset_end . " day') AND date('now', '-" . $offset . " day') ORDER BY timestamp";
}
if (isset($_REQUEST['test'])) {
    $statement = "SELECT timestamp,state FROM toilet_data ORDER BY timestamp desc limit 10";
}
try {
    //open the database
    $db_path=$_SERVER['DOCUMENT_ROOT'].'/toilet.sqlite';
    $db = new PDO("sqlite:$db_path");
    $result = $db->prepare($statement);
    $result->execute();
    $value = $result->fetchAll(PDO::FETCH_ASSOC);

    foreach ($value as $row) {
        echo $row['timestamp'] . ',' . $row['state'] . ';';
    }
    $db = null;
} catch (PDOException $e) {
    echo 'Exception : ' . $e->getMessage();
    http_response_code(500);
}
