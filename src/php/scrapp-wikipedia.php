<?php
include(__DIR__.'/simplehtmldom_1_9_1/simple_html_dom.php');

header('Content-Type: text/plain; charset=utf-8');

if(!isset($_GET['location'])){
    $location = "Besan%C3%A7on";
}else{
	$location = $_GET['location'];
}

$html = file_get_html('https://fr.wikipedia.org/wiki/'.$location);
$paragraph = $html->find('#mw-content-text > .mw-parser-output > p',1)->outertext;
if($paragraph == null){
    $paragraph = $html->find('#mw-content-text > .mw-parser-output > p',0)->outertext;
}
print_r($paragraph);