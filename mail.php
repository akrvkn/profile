<?php
if(isset($_POST['email'])) {
     
    // EDIT THE BELOW TWO LINES AS REQUIRED
    $email_to = "support@superuser.su";
    $email_subject = "Message From Ubiquitous Template";
     
     
    function errorMesg() {
        // Error code can go here
        echo "There were error(s) found with the form you submitted. ";
        echo "<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
    }
     
    // validation expected data exists
    if(!isset($_POST['name']) ||
        !isset($_POST['email']) ||
        !isset($_POST['mymessage'])) {
        errorMesg();       
    }
     
    $name = $_POST['name']; // required
    $email_from = $_POST['email']; // required
	$mysubject = $_POST['mysubject']; // required
    $mymessage = $_POST['mymessage']; // required
     
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
     
    $email_message .= "Name: ".clean_string($name)."\n";
    $email_message .= "Email: ".clean_string($email_from)."\n";
	$email_message .= "Subject: ".clean_string($mysubject)."\n";
    $email_message .= "Message: ".clean_string($mymessage)."\n";
     
     
// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
@mail($email_to, $email_subject, $email_message, $headers);  
?>

<?php
}
?>