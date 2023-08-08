<?php
ini_set("log_errors",1);
ini_set("error_log", "/dev/stderr");
header('Access-Control-Allow-Origin: *');
$cmd = "";
$ret = array();
$login = "";
$loginId = -1;
$db = new SQLite3("data/db.sqlite");
$db->exec("CREATE TABLE IF NOT EXISTS user(login VARCHAR NOT NULL UNIQUE)");
$db->exec("CREATE TABLE IF NOT EXISTS workout(loginId BIGINT NOT NULL, weekCount BIGINT NOT NULL, name VARCHAR NOT NULL,type VARCHAR)");
$db->exec("CREATE TABLE IF NOT EXISTS item(loginId BIGINT NOT NULL, workoutId BIGINT NOT NULL, time BIGINT NOT NULL, count INT NOT NULL)");

if (isset($_SERVER['TLS_CLIENT_DN'])) {
    $TLS_DN = explode(",", $_SERVER['TLS_CLIENT_DN']);
    foreach ($TLS_DN as $v) {
        if (str_starts_with($v, "CN=")) {
            $login = strtolower(substr($v, 3));
            break;
        }
    }
}

if (strlen($login) == 0) {
    if ($_SERVER["SERVER_PORT"] == 3001) {
        $login = "tom";
    } else {
        header('HTTP/1.1 401 Unauthorized');
        die('Auth failed');
    }
}

$query = $db->prepare("SELECT oid,login FROM user WHERE login=:login");
$query->bindValue(":login", $login);
$result = $query->execute();
if ($row = $result->fetchArray(SQLITE3_NUM)) {
    $loginId = $row[0];
} else {
    $query = $db->prepare("INSERT INTO user(login) VALUES(:login)");
    $query->bindValue(":login", $login);
    $result = $query->execute();
}

if (isset($_GET["cmd"])) {
    $cmd = $_GET["cmd"];
    $params = json_decode(file_get_contents('php://input'), true);
    error_log($cmd." : ".json_encode($params)." loginId:".$loginId);

    if ($cmd == "list") {
        $monday = $params["monday"];
        $item = array();
        $item["id"] = -1;
        $item["name"] = "Name";
        $item["type"] = "";
        $item["weekCount"] = "Total";
        $item["sum"] = "";
        $item["count"] = "";
        array_push($ret, $item);
        $query = $db->prepare("SELECT oid,name,type,weekCount FROM workout WHERE loginId=:loginId ORDER BY lower(name)");
        $query->bindValue(":loginId", $loginId);
        $result = $query->execute();
        while ($row = $result->fetchArray(SQLITE3_NUM)) {
            $id = $row[0];
            $wItemQuery = $db->prepare("SELECT SUM(count),COUNT(count) FROM item WHERE workoutId=:wid AND time >= :monday");
            $wItemQuery->bindValue(":wid",$id);
            $wItemQuery->bindValue(":monday", $monday);
            $wItemResult = $wItemQuery->execute();
            if($wItemRow = $wItemResult->fetchArray(SQLITE3_NUM)){
                $item = array();
                $item["id"] = $row[0];
                $item["name"] = $row[1];
                $item["type"] = $row[2];
                $item["weekCount"] = $row[3];
                $item["sum"] = $wItemRow[0];
                $item["count"] = $wItemRow[1];
                array_push($ret,$item);
            }
        }
    } else if($cmd == "addWorkout"){
        $query = $db->prepare("INSERT INTO workout(loginId, weekCount, name, type) VALUES (:loginId,:weekCount,:name,:type)");
        $query->bindValue(":loginId", $loginId);
        $query->bindValue(":weekCount", $params["weekCount"]);
        $query->bindValue(":name", $params["name"]);
        $query->bindValue(":type", $params["type"]);
        $result = $query->execute();
    } else if ($cmd == "editWorkout") {
        $query = $db->prepare("UPDATE workout SET weekCount=:weekCount,name=:name,type=:type WHERE loginId=:loginId AND oid=:id");
        $query->bindValue(":loginId", $loginId);
        $query->bindValue(":weekCount", $params["weekCount"]);
        $query->bindValue(":name", $params["name"]);
        $query->bindValue(":type", $params["type"]);
        $query->bindValue(":id", $params["id"]);
        $result = $query->execute();
    } else if($cmd == "deleteWorkout"){
        $query = $db->prepare("DELETE FROM item WHERE loginId=:loginId AND workoutId=:workoutId");
        $query->bindValue(":loginId", $loginId);
        $query->bindValue(":workoutId", $params["id"]);
        $result = $query->execute();
        $query = $db->prepare("DELETE FROM workout WHERE loginId=:loginId AND oid=:workoutId");
        $query->bindValue(":loginId", $loginId);
        $query->bindValue(":workoutId", $params["id"]);
        $result = $query->execute();
    } else if ($cmd == "addItem") {
        $query = $db->prepare("INSERT INTO item(loginId, workoutId, time, count) VALUES (:loginId,:workoutId,:time,:count)");
        $query->bindValue(":loginId", $loginId);
        $query->bindValue(":workoutId", $params["id"]);
        $query->bindValue(":time", $params["time"]);
        $query->bindValue(":count", $params["count"]);
        $result = $query->execute();
    }
}

$db->close();
echo json_encode($ret);
echo "\n";
