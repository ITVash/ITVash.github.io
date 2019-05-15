<?php
	$method = $_GET['method'];
	if ($method == 'add') {
		$name = $_GET['name'];
		$point = $_GET['point'];
		file_put_content('db.txt', $point);
	} else {
		# code...
	}
?>