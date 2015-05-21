<?php

  $value = '/images/toilet_error.png';
  if(isset($_REQUEST['v'])){
  	try{
    	//open the database
    	$db = new PDO('sqlite:toilet.sqlite');
      if(isset($_REQUEST['id'])){
        $tag = $_REQUEST['id'];
      }else{
        $tag = 1;
      }
      $statement="SELECT * FROM toilet_data where id = ".$tag." ORDER BY timestamp desc limit 1";
      $db = new PDO('sqlite:toilet.sqlite');
      $result = $db->prepare($statement);
      $result->execute();
      $value = $result->fetchAll(PDO::FETCH_ASSOC);
      // var_dump($value);
      foreach($value as $row){
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
      // echo $e->getMessage();
      
  	}
  }
  echo $value;
?>
