<?php
include(__DIR__.'/simplehtmldom_1_9_1/simple_html_dom.php');

header('Content-Type: application/json; charset=utf-8');

if(!isset($_GET['location'])){
    $location = "Besan%C3%A7on";
}else{
	$location = $_GET['location'];
}

$html = file_get_html('https://en.wikipedia.org/wiki/'.$location);

$paragraph = $html->find('#mw-content-text > .mw-parser-output > p',1)->outertext;
if (is_array($paragraph)) {
    $paragraph=$html->find('#mw-content-text > .mw-parser-output > p',1)[0]->outertext;
} elseif($paragraph == null){
    $paragraph = $html->find('#mw-content-text > .mw-parser-output > p',0)->outertext;
}

$paragraph2 = $html->find('#mw-content-text > .mw-parser-output > p',2)->plaintext;
if (is_array($paragraph2)) {
    $paragraph2=$html->find('#mw-content-text > .mw-parser-output > p',2)[0]->outertext;}

$paragraph3 = $html->find('#mw-content-text > .mw-parser-output > p',3)->plaintext;
if (is_array($paragraph3)) {
    $paragraph3=$html->find('#mw-content-text > .mw-parser-output > p',3)[0]->outertext;}

$paragraph4 = $html->find('#mw-content-text > .mw-parser-output > p',4)->plaintext;
if (is_array($paragraph4)) {
    $paragraph4=$html->find('#mw-content-text > .mw-parser-output > p',4)[0]->outertext;}

$text = $html->find('#mw-content-text')[0]->outertext;
// $population = $html->find('#mw-content-text > div.mw-parser-output > table.infobox.ib-settlement.vcard > tbody > tr:nth-child(20)')[0]->outertext;
// $area = $html->find('#mw-content-text > div.mw-parser-output > table.infobox.ib-settlement.vcard > tbody > .mergedtoprow:nth-child(17) > .infobox-data')[0]->outertext;

$resultData=array();
$resultData['paragraph']=$paragraph;
$resultData['paragraph2']=$paragraph2;
$resultData['paragraph3']=$paragraph3;
$resultData['paragraph4']=$paragraph4;
// $resultData['population']=$population;
// $resultData['area']=$area;

$result=json_encode($resultData);
print_r($result);
// print_r($text);