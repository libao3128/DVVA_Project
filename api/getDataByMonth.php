<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: *");
  header("Access-Control-Allow-Headers: Origin, Methods, Content-Type");
  if(@$_REQUEST["year"] != "" && @$_REQUEST["month"] != "" && (@$_REQUEST["type"] == "Rain" || @$_REQUEST["type"] == "Temperature")){
    if(@$_REQUEST["apikey"] == "sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6"){
      require("sql.php");
      if($_REQUEST["type"] == "Rain"){
        $query = sprintf("CALL getRainDataByMonth('%s','%s');",
            mysqli_real_escape_string($cn,$_REQUEST["year"]),
              mysqli_real_escape_string($cn,$_REQUEST["month"]));
      }else if($_REQUEST["type"] == "Temperature"){
        $query = sprintf("CALL getTempDataByMonth('%s','%s');",
            mysqli_real_escape_string($cn,$_REQUEST["year"]),
            mysqli_real_escape_string($cn,$_REQUEST["month"]));
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
    // echo '{"Result": "Bad Request", "echo": { year: "'.$_REQUEST["year"].'", month: "'.$_REQUEST["month"].'", type: "'.$_REQUEST["type"].'" }}';
  }
?>
