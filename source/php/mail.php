<?php

$recepient = "166507@gmail.com";
$sitename = "My Site Name";

$name = trim($_POST["name"]);
$phone = trim($_POST["email"]);
$text = trim($_POST["message"]);
$message = "Имя: $name \nТелефон: $email \nТекст: $message";

$pagetitle = "Новая заявка с сайта \"$sitename\"";
mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");