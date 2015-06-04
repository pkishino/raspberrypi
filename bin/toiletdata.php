<?php

try {
    //open the database
    $db = new PDO('sqlite:toilet.sqlite');

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
