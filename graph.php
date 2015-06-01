<?php
  $offset = $_REQUEST['offset'];
  $offset_end = $offset + 1;
  if(isset($_REQUEST['id'])){
      $id = $_REQUEST['id'];
      if($offset >= 0){
        $statement="SELECT timestamp, state FROM toilet_data WHERE id = ".$id." AND timestamp BETWEEN date('now','-".$offset_end." day') AND date('now', '-".$offset." day') ORDER BY timestamp";
      }else{
       $statement="SELECT timestamp, state FROM toilet_data WHERE id = ".$id." AND timestamp > date('now') ORDER BY timestamp"; 
      }
  }else{
      $statement="SELECT timestamp, state FROM toilet_data WHERE timestamp BETWEEN date('now','-".$offset_end." day') AND date('now', '-".$offset." day') ORDER BY timestamp";
  }
  if(isset($_REQUEST['test'])){
    $statement="SELECT timestamp,state FROM toilet_data ORDER BY timestamp desc limit 10";
  }
  try{
    //open the database
    $db = new PDO('sqlite:toilet.sqlite');
    $result = $db->prepare($statement);
    $result->execute();
    $value = $result->fetchAll(PDO::FETCH_ASSOC);

    foreach($value as $row){
      echo $row['timestamp'].','.$row['state'].';';
    }
    $db = NULL;
  }
  catch(PDOException $e){
     echo 'Exception : '.$e->getMessage();
  }
  
?>
