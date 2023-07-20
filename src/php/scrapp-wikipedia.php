<?php
include(__DIR__.'/simplehtmldom_1_9_1/simple_html_dom.php');

header('Content-Type: application/json; charset=utf-8');

if(!isset($_GET['location'])){
    $location = "Besan%C3%A7on";
}else{
	$location = $_GET['location'];
}

$html = file_get_html('https://en.wikipedia.org/wiki/'.$location);

$resultData=array();
$i= 1;
$total = 0;

do {
    $p = $html->find('#mw-content-text > .mw-parser-output > p',$i)->outertext;
    if (is_array($p)) {
        $p = $html->find('#mw-content-text > .mw-parser-output > p',$i)[0]->outertext;
    }
    elseif($p==1 && $p==null){
        $p = $html->find('#mw-content-text > .mw-parser-output > p',0)->outertext;
    }

    $pNext = $html->find('#mw-content-text > .mw-parser-output > p',$i+1)->outertext;
    if (is_array($pNext)) {
        $pNext=$html->find('#mw-content-text > .mw-parser-output > p',$i+1)[0]->outertext;
    }

    if ($i==1) {
        $total += strlen(strip_tags($p)) + strlen(strip_tags($pNext));
    } else {
        $total += strlen(strip_tags($pNext));
    }

    $resultData[] = $p;
    $i++;
} while ($total < 1600 && $pNext!=null);

$result=json_encode($resultData);
print_r($result);