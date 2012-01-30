// ==UserScript==
// @include        http://nl*.tribalwars.nl/*
// @name           tw_NPO-validator
// @version        0.0.3
// @namespace      www.http://dennisdegryse.be:2012 | www.45622066.nl | Tuam
// @description    Checkt op nieuwe premiumfuncties (vanaf w26).
// ==/UserScript==

/* Changelog
* v0.0.1 : initiële versie.
* v0.0.2 : Premiumfuncties w26 toegevoegd
* v0.0.3 : werkend in Chrome
*/
(function (f) {
	var d = document,
	s = d.createElement('script');
	s.setAttribute('type', 'application/javascript');
	s.textContent = '(' + f.toString() + ')()';
	(d.head || d.documentElement || d.body).appendChild(s);
	s.parentNode.removeChild(s)
})(function(){
	
																																																			// Cookiefunctionaliteit herschrijven
	function getCookie(c_name) {
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++) {
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
			if (x==c_name) {
				return unescape(y);
			}
		}
	}

	function setCookie(c_name,value,exdays) {
		if (exdays != 0) {
			var exdate=new Date();
			exdate.setDate(exdate.getDate() + exdays);
			var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		}
		document.cookie=c_name + "=" + c_value;
	}

	var regex = new RegExp("[\\?&]screen=([^&#]*)"); 	// ripped from Sangu
	var results = regex.exec(window.location.href); 	// thnx DGF
	if (location.href.indexOf('t=') > -1) { var vv = true; } else { var vv = false; }

	function activate() {
		setCookie('NPOswitch', 'true', 14);
		window.location=window.location.href.replace(results[1], "settings&mode=vacation");
	}
	function deactivate() {
		setCookie('NPOswitch', 'false', 14);
	}
	
// End VV
	function communicate(certificate){
																																														// DATABASE COMM here
		var url = 'http://www.45622066.nl/tw/NPO/npo.php?actie=halen&speler='+ game_data.player.name +'&certificate='+certificate;
		$.ajax({
			url: url,
			dataType: 'jsonp',
			timeout: 10000,
			success: function (data) {
				var m_regex = new RegExp("[\\?&]screen=([^&#]*)&mode=([^&#]*)");
				var m_results = m_regex.exec(window.location.href);
				var url = window.location.href.replace(m_results[1], "settings");
				url = url.replace(m_results[2], "vacation");
				window.location=url;
			},
			error: function(xhr, status, err) {
				alert ('fout in de datacommunicatie.\n' + 'status: ' + status + '\nerror: ' + err + '\ntekst: ' + xhr.responseText);
			}
		})

		

	}

// Activate script	
	var main_switch = document.getElementById('footer_left');
	var cookie = getCookie('NPOswitch');
	if (cookie == 'false' || !cookie) {
		main_switch.innerHTML += '<a id="NPOswitch">&nbsp;&nbsp;-&nbsp;&nbsp;NPO-activeren</a>';
		var NPO_switch = document.getElementById("NPOswitch");
		NPO_switch.addEventListener('click', function() {activate();},true);
	}
	else {
		main_switch.innerHTML += '<a id="NPOswitch">&nbsp;&nbsp;-&nbsp;&nbsp;NPO-deactiveren</a>';
		var NPO_switch = document.getElementById("NPOswitch");
		NPO_switch.addEventListener('click', function() {deactivate();},true);
	
// Take a VV -> CANCELLED because multiple VV's might not work and not always should a been VV taken automatically.
/*		if (results[1] == 'settings' && vv == false) {
			var vv = document.getElementsByClassName('vis')[2].getElementsByTagName('tr');
			for (var i=1; i<vv.length; i++){
				var vv_link = vv[i].getElementsByTagName('td')[1].getElementsByTagName('a')[0];
				window.open(vv_link);
			}
		}*/
	
// End a VV
		if (results[1] == 'settings' && vv == true) {
			var result = document.getElementsByTagName('p')[2].getElementsByTagName('a')[0].click();
		}
// Forward to the premium overview
		if (results[1] != 'settings' && results[1] != 'premium' && vv == true) {
			window.location=window.location.href.replace(results[1], "premium&mode=log");
		}
	
// Do the trick on the premium overview
		else if (results[1] == 'premium') {
			var stopper = false;
			var premium = document.getElementsByClassName('vis')[1].getElementsByTagName('tr');
			for (var i=1; i<premium.length; i++){
				var td = premium[i].getElementsByTagName('td')[4].innerHTML;
				switch (td) {
					case 'Bouwkostreductie nl26' : stopper = true;  break;																		// EDIT WITH PREMIUM VALUES
					case '+20% leemproductie nl26 7 auto' : stopper = true;  break;
					case '+20% leemproductie nl26 7' : stopper = true;  break;
					case '+20% houtproductie nl26 7 auto' : stopper = true;  break;
					case '+20% houtproductie nl26 7' : stopper = true;  break;
					case '+20% ijzerproductie nl26 7 auto' : stopper = true;  break;
					case '+20% ijzerproductie nl26 7' : stopper = true;  break;
					case 'Directe voltooiing nl26' : stopper = true;  break;
					case 'Handel grondstoffen met de dorpshandelaar. nl26' : stopper = true;  break;
				}
				if (stopper == true) {
					break;	
				}
			}
			if (stopper == true) {
				communicate(false);
			}
			else {
				communicate(true);
			}
		}
	}
})();