<?php

    try{
  	//open the database
  	$db = new PDO('sqlite:toilet.sqlite');

    $result = $db->query('SELECT * FROM toilet_data GROUP BY id ORDER BY timestamp');
    $first = True;

    $value="{ ";
  	foreach($result as $row){
            if ($first == False) {
                $value = $value.", ";
            } else {
                $first = False;
            }
            $value = sprintf("%s\"%s\" : %s", $value, $row['id'], $row['state']);
        }
    }
    catch(PDOException $e){
        $value = 'Exception : '.$e->getMessage();
    }
    $value = $value."}";
    $db = NULL;
    echo $value;
?>
