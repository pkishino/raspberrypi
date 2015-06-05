<?php
// Tell browsers not to cache the file output so we can count all hits
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
$value = '../images/toilet_error.png';
try {
    //open the database
    $db = new PDO('sqlite:../toilet.sqlite');
    if (isset($_REQUEST['id'])) {
        $tag = $_REQUEST['id'];
    } else {
        $tag = 1;
    }
    $statement = "SELECT * FROM toilet_data where id = " . $tag . " ORDER BY timestamp desc limit 1";
    $db = new PDO('sqlite:../toilet.sqlite');
    $result = $db->prepare($statement);
    $result->execute();
    $value = $result->fetchAll(PDO::FETCH_ASSOC);
    foreach ($value as $row) {
        if ($row['id'] == $tag) {
            if ($row['state'] == 0) {
                $value = '../images/toilet_green.png';
            } else {
                $value = '../images/toilet_red.png';
            }
        }
    }
    $db = null;
} catch (PDOException $e) {
    // echo $e->getMessage();

}
echo $value;
