// ==UserScript==
// @include        http://nl*.tribalwars.nl/*screen=premium&mode=log*
// @name           tw_NPO-checker
// @version        0.0.1
// @namespace      www.http://dennisdegryse.be:2012 | www.45622066.nl | Tuam
// @description    Checkt op nieuwe premiumfuncties (vanaf w26).
// ==/UserScript==

/* Changelog
* v0.0.1 : initiële versie.
*/
(function (f) {
	var d = document,
	s = d.createElement('script');
	s.setAttribute('type', 'application/javascript');
	s.textContent = '(' + f.toString() + ')()';
	(d.head || d.documentElement || d.body).appendChild(s);
	s.parentNode.removeChild(s)
})(function(){
	
	function haal_data(a, b, c, d) {
		if (d == null){
			var url = 'http://www.45622066.nl/tw/NPO/npo.php?actie=halen';
			var stopper = 0;
		}
		else {
			var url = 'http://www.45622066.nl/tw/NPO/npo.php?actie=brengen&a='+a+'&b='+b+'&c='+c+'&d='+d;
			var stopper = 1;
		}
		$.ajax({
			url: url,
			dataType: 'jsonp',
			timeout: 15000,
			success: function (data) {
				if (stopper == 0){
					auth(data);
				}
				else if (data.auth == 'Done') {
					alert('Je certificaat is toegekend');
				}
				else if (data.auth == 'Valsspeler') {
					alert('Je bent geschorst uit het NPO-project doordat je valse data verstuurd hebt');
				}
				else {
					alert('Storing in de communicatie');
				}
			},
			error: function(xhr, status, err) {
				alert ('fout in de datacommunicatie.\n' + 'status: ' + status + '\nerror: ' + err + '\ntekst: ' + xhr.responseText);
			}
		})
	}

	function auth(key) {
		var stopper = false;
		var results = '';
		var premium = document.getElementsByClassName('vis')[1].getElementsByTagName('tr');
		for (var i=1; i<premium.length; i++){
			var td0 = premium[i].getElementsByTagName('td')[0].innerHTML;
			var td1 = premium[i].getElementsByTagName('td')[4].innerHTML;
			results += td0 + '|' + td1 + '^';
		}
		var key1 = document.getElementById('serverDate').innerHTML;
		var key2 = document.getElementById('serverTime').innerHTML;
		haal_data(results, key1, key2, key.auth);
	}
	haal_data();
})();