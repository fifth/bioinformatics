<?php
	header("Access-Control-Allow-Origin: *");
	error_reporting(E_ALL & ~ E_NOTICE);
	// input format:
	// $seq: DNA senquence
	// $min_len: min length of the repeat
	// $max_len: max length of the repeat
	// $p: min repeat time
	// $r: gate value
	// $seq='CGCAGCGTGGCTGGAGAAACGTTGTCAAAAAGACGAGTCGCCACTCACTGGGAATAGTCGGCAAGCATCGTACACAATGTTTAACTCTCAGTCACCGTTCCGACTCGCGGAGCCGTGTATCGG';
	// $seq=str_split('CGCAGCGTGGCTGGAGAAACGTTGTCAAAAAGACGAGTCGCCACTCACTGGGAATAGTCGGCAAGCATCGTACACAATGTTTAACTCTCAGTCACCGTTCCGACTCGCGGAGCCGTGTATCGG');
	// $seq=str_split('ACCGGGCGTTGAGTTGCCTGACTCAGTCGCGTCTGATAGTCTGATAGAGTAGGACGCACCTGTCTGAATAGCGAGACAACTAGAGCCAAACCTCAGCTAG');
	$seq=str_split($_POST["senquence"]);
	$min_len=$_POST["min_len"];
	$max_len=$_POST["max_len"];
	$p=$_POST["repeat"];
	$r=$_POST["r"];
	// input over
	$stroage=array();
	$msatr=array();
	$total=0;
	$repeat=1;
	$buffer=array();

	function compare($compare, $r) {
	// compare the two senquences 
		// $stroage: senquence used to be compared
		// $compare: senquence used to compare
		// $r: gate value
		global $stroage;
		$len=count($compare);
		foreach (array_chunk($stroage, $len) as $key => $value) {
			$count=0;
			for ($i=0; $i<$len; $i++) {
				if ($value[$i]==$compare[$i]) {
					$count++;
				}
			}
			if ($count/$len<$r) {
				return false;
			}
		}
		return true;
	}

	function check($p) {
	// check the repeat times of the buffer
		// $target
		// $len
		// $p
		global $stroage, $msatr, $total, $repeat;
		if ($repeat>=2) {
			if ($repeat>=$p) {
				$msatr[$total]['senquence']=implode($stroage);
				$msatr[$total]['repeat']=$repeat;
				$msatr[$total]['length']=strlen($msatr[$total]['senquence'])/$repeat;
				$total++;
			}
		} 
		$stroage=array();
		$repeat=1;
	}

	for ($rep=$min_len; $rep<=$max_len; $rep++) {
		// divide the senquence 
		for ($i=0; $i<$rep; $i++) { 
			$array[$i]=array_chunk(array_slice($seq, $i), $rep);
		}
		// divide over

		for ($i=0; $i<$rep; $i++) {
			$stroage=array();
			$buffer=$array[$i][0];
			$stroage=$buffer;
			$key_of_buffer=0;
			$tip=$key_of_buffer+1;
			while (($key_of_buffer<count($array[$i]))&&($tip<count($array[$i]))) {
				if ((compare($array[$i][$tip], $r))&&(count($array[$i][$tip])==$rep)) {
					$stroage=array_merge($stroage, $array[$i][$tip]);
					$repeat++;
				} else {
					check($p);
					$buffer=$array[$i][$tip];
					$stroage=$buffer;
					$key_of_buffer=$tip;
				}
				$tip+=1;
			}
			check($p);
		}

		// // check the devision
		// for ($i=0; $i<$rep; $i++) {
		// 	for ($j=0; $j<floor(count($seq)/$rep); $j++) {
		// 		for ($k=0; $k<$rep; $k++) { 
		// 			echo $array[$i][$j][$k];
		// 		} 			
		// 		echo " ";
		// 	}
		// 	echo "<br/>";
		// }
	}	
		// print_r($total);
		// for ($i=0; $i<$total; $i++) {
		// 	print_r("<br/>");
		// 	print_r(json_encode($msatr[$i]));
		// }
	echo json_encode($msatr);
?>