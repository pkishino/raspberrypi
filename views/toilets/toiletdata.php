<?php
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
try {
    //open the database
    $db_path=$_SERVER['DOCUMENT_ROOT'].'/toilet.sqlite';
    $db = new PDO("sqlite:$db_path");

    $result = $db->query('SELECT * FROM toilet_data GROUP BY id ORDER BY timestamp');
    $first = true;

    $value = "{ ";
    foreach ($result as $row) {
        if ($first == false) {
            $value = $value . ", ";
        } else {
            $first = false;
        }
        $value = sprintf("%s\"%s\" : %s", $value, $row['id'], $row['state']);
    }
} catch (PDOException $e) {
    $value = 'Exception : ' . $e->getMessage();
}
$value = $value . "}";
$db = null;
echo $value;
