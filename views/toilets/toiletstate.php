<?php

header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
try {
    if (isset($_REQUEST['id'])) {
        $tag = $_REQUEST['id'];
    } else {
        $tag = 1;
    }
    $statement = "SELECT * FROM toilet_data where id = " . $tag . " ORDER BY timestamp desc limit 1";
    $db_path=$_SERVER['DOCUMENT_ROOT'].'/toilet.sqlite';
    $db = new PDO("sqlite:$db_path");
    $result = $db->prepare($statement);
    $result->execute();
    $value = 'images/toilet_error.png';
    $value = $result->fetchAll(PDO::FETCH_ASSOC);
    foreach ($value as $row) {
        if ($row['id'] == $tag) {
            if ($row['state'] == 0) {
                $value = '/views/toilets/images/toilet_green.png';
            } else {
                $value = '/views/toilets/images/toilet_red.png';
            }
        }
    }
    $db = null;
    echo $value;
} catch (PDOException $e) {
    echo 'Exception : ' . $e->getMessage();
    http_response_code(500);
}
