<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: *");
  header("Access-Control-Allow-Headers: Origin, Methods, Content-Type");
  if(@$_REQUEST["lon"] != "" && @$_REQUEST["lat"] != "" && (@$_REQUEST["type"] == "Rain" || @$_REQUEST["type"] == "Temperature")){
    if(@$_REQUEST["apikey"] == "sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6"){
      require("sql.php");
      if($_REQUEST["type"] == "Rain"){
        $query = sprintf("CALL getYearRainDataByLoc('%s','%s');",
            mysqli_real_escape_string($cn,$_REQUEST["lon"]),
            mysqli_real_escape_string($cn,$_REQUEST["lat"]));
      }else if($_REQUEST["type"] == "Temperature"){
        $query = sprintf("CALL getYearTempDataByLoc('%s','%s');",
            mysqli_real_escape_string($cn,$_REQUEST["lon"]),
            mysqli_real_escape_string($cn,$_REQUEST["lat"]));
      }
      $data = mysqli_query($cn,$query);
      $count = mysqli_num_rows($data);
      
      $json = array();
      $i = 0;
      while($row = mysqli_fetch_array($data, MYSQLI_ASSOC)){
        $json[$i] = $row;
        $i++;
      }
      $json2 = array("Result" => $json);
      header('Content-Type: application/json; charset=utf-8');
      echo json_encode($json2);
    }else{
      header('Content-Type: application/json; charset=utf-8');
      http_response_code(401);
      echo '{"Result": "Unauthorized"}';
    }
  }else{
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(400);
    echo '{"Result": "Bad Request"}';
  }
?>
