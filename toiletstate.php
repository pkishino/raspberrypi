<?php

	try{
  	//open the database
  	$db = new PDO('sqlite:toilet.sqlite');

    $result = $db->query('SELECT * FROM toilet_data GROUP BY id ORDER BY timestamp');

    $tag = $_REQUEST['id'];
    $value="";
  	foreach($result as $row){
      if($row['id'] == $tag){
        if ($row['state'] == 0){
          $value = '/images/toilet_green.png';
        }else{
          $value = '/images/toilet_red.png';
        }
      }
  	}
  	$db = NULL;
	}
	catch(PDOException $e){
	   $value = 'Exception : '.$e->getMessage();
	}
  echo $value;
?>
