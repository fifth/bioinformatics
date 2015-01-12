var backup;
function random_senquence(){
	len = prompt('enter the length of random DNA senquence:');
	var v = new Array();
	v[0]='A';
	v[1]='T';
	v[2]='G';
	v[3]='C';
	print='';
	for (var i = 0; i < len; i++) {
		print+=v[Math.floor(Math.random()*4)];
	};
	document.getElementById('senquence').value=print;
}

// 	return string;
// }
function send_quest(){
	document.getElementById('answer').innerHTML="<img src='./waiting.gif' /><br />plsase waiting for the results";
	senquence=document.getElementById('senquence').value;
	min_len=document.getElementById('min_len').value;
	max_len=document.getElementById('max_len').value;
	repeat=document.getElementById('repeat').value;
	r=document.getElementById('r').value;
	if ((senquence.search("[^ACGT]")>-1)||(min_len.search("[^0-9]")>-1)||(max_len.search("[^0-9]")>-1)||(repeat.search("[^0-9]")>-1)||(r.search("[^0-9\.]")>-1)) {
		answer="INPUT ERROR!<br/>";
		if (senquence.search("[^ACGT]")>-1) {
			answer+="You are entering a DNA senquence, aren't you?<br/>";
		}
		if ((min_len.search("[^0-9]")>-1)||(max_len.search("[^0-9]")>-1)||(repeat.search("[^0-9]")>-1)||(r.search("[^0-9\.]")>-1)) {
			answer+="Only numbers can be param"
		}
		document.getElementById("answer").innerHTML=answer;
		$('#step_answer input').css('height', $('#step_answer input').css('height'));
		document.getElementById("step_answer").style.height=$('#answer').css('height').slice(0, -2)*1.0+$('#answer').css('margin-top').slice(0, -2)*1.0+$('#answer').css('margin-bottom').slice(0, -2)*1.0+$('#step_answer input').css('margin-top').slice(0, -2)*1.0+$('#step_answer input').css('height').slice(0, -2)*1.0;
		return false;
	}
	var xmlhttp;
	xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			backup=xmlhttp.responseText
			var list=eval('('+backup+')');
			// sample format = [{start}]{senquence}[{end}]|{repeat}|{length}

			format=$("#format").val();
			devide=$("#devide").val();
			format_copy=format;
			answer='';
			format=format.replace(/{/g, '');
			format=format.replace(/}/g, '');
			answer+=format;
			format=format_copy;
			answer+='<br />'
			for (key in list) {
				// answer+=list[key]['senquence'];
				//format the style of the senquence
				format=format.replace(/{start}/, list[key]['senquence'].substring(0,list[key]['senquence'].indexOf(',')));
				format=format.replace(/{senquence}/, list[key]['senquence'].substring(list[key]['senquence'].indexOf(',')+1, list[key]['senquence'].lastIndexOf(',')).replace(/,/g, devide));
				format=format.replace(/{end}/, list[key]['senquence'].substring(list[key]['senquence'].lastIndexOf(',')+1));
				format=format.replace(/{repeat}/, list[key]['repeat']);
				format=format.replace(/{length}/, list[key]['length']);
				answer+=format;
				format=format_copy;
				answer+="<br />";
				//format end
			}
			document.getElementById("answer").innerHTML=answer;
			$('#step_answer input').css('height', $('#step_answer input').css('height'));
			document.getElementById("step_answer").style.height=$('#answer').css('height').slice(0, -2)*1.0+$('#answer').css('margin-top').slice(0, -2)*1.0+$('#answer').css('margin-bottom').slice(0, -2)*1.0+$('#step_answer input').css('margin-top').slice(0, -2)*1.0+$('#step_answer input').css('height').slice(0, -2)*1.0;
		}
	}	
	xmlhttp.open("POST","msatr.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("senquence="+senquence+"&min_len="+min_len+"&max_len="+max_len+"&repeat="+repeat+"&r="+r);
}
function scroll_to(step){
	a=new Array("input", "param", "output", "answer");
	$.scrollTo('#step_'+a[step], 500);
}