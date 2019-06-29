<?php
switch ($_POST['action']) {
    case 'sauvegarde':
        $PlayerData =$_POST['data'];
        $username = addslashes($_POST['username']);
        file_put_contents('save/'.$username.'.json',$PlayerData);
        break;
    case 'check_username':
        $username = addslashes($_POST['username']);
        if (file_exists('save/'.$username.'.json')) {
            echo file_get_contents('save/'.$username.'.json');
        }
    default:
        break;
}
die();

?>
