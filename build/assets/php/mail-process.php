<?php
	include 'defines.php';
	include 'email-valid.php';
	$post = (!empty($_POST)) ? true : false;
	if($post){
		$name = stripslashes($_POST['name']);
		$email = stripslashes($_POST['email']);
		$text = stripslashes($_POST['message']);
		$subject = 'Заявка';
		$error = '';
		$message = '
			<html>
					<head>
							<title>Заявка</title>
					</head>
					<body>
							<p>Имя: '.$name.'</p>
							<p>Email : '.$email.'</p>
							<p>Сообщение : '.$text.'</p>
					</body>
			</html>';
		// если в заголовках есть русские буквы - то их нужно кодировать, т.к.
		// в Content-Type задаётся только кодировка тела, которое может быть отослано в любой кодировке.
		// это необходимо для нормлаьного отображения в OUTLOOK и THE BAT
		$name = '=?UTF-8?B?'.base64_encode($name).'?=';
		$subject = '=?UTF-8?B?'.base64_encode($subject).'?=';
		if (!ValidateEmail($email)){
			$error = 'Email введен неправильно!';
		}
		if(!$error){
			$mail = mail(CONTACT_FORM, $subject, $message,
			     "From: ".$name." <".$email.">\r\n"
			    ."Reply-To: ".$email."\r\n"
			    ."Content-type: text/html; charset=utf-8 \r\n"
			    ."X-Mailer: PHP/" . phpversion());
			if($mail){
				echo 'OK';
			}
		}else{
			echo ''.$error.'';
		}
	}
?>