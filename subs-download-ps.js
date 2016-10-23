//INSERT THIS
var jq = document.createElement('script');
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
//PRESS ENTER

//THEN INSERT THIS AND ENTER
jQuery.noConflict();

//http://stackoverflow.com/a/901144/7059638
function getQueryParam(name, url) {
	if (!url) {
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};

//http://stackoverflow.com/a/19818659/7059638
var saveFile = function(data, filename) {
	if(!data) {
		console.error('Console.save: No data')
		return;
	}
	if(!filename) filename = 'some_sub.srt';
	var blob = new Blob([data], {type: 'text/plain'}),
	e    = document.createEvent('MouseEvents'),
	a    = document.createElement('a')

	a.download = filename
	a.href = window.URL.createObjectURL(blob)
	a.dataset.downloadurl =  ['text/plain', a.download, a.href].join(':')
	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
	a.dispatchEvent(e)
};

//https://github.com/rg3/youtube-dl/issues/9681@jmvtrinidad 
function subtitleAsSRT(o) {
	return o.map(function(sub, i) {
		function time(ms) {
			return new Date(ms).toISOString().slice(11, -1).replace('.',',');
		}
		var nextIndex = i + 1 == o.length ? o.length - 1 : i + 1;
		return (i + 1) + "\r\n" + time(sub.displayTimeOffset* 1000) + " --> " + time(o[nextIndex].displayTimeOffset * 1000) + "\r\n" + sub.text;
	}).join("\r\n\r\n");
};

function downloadSubs() {
	var c = 0;
	jQuery('.course-transcript__module').each(function(i){
		var mainTitle = jQuery(this).find(".course-transcript__module-header").text();
		var clipTitle = jQuery(this)
		.find(".course-transcript__clip-header")
		.each(function(ii,clipHeader){
			c++;
			var p = jQuery(clipHeader).siblings().get(0);
			var filename = (c<10?"0"+c:c) + "-" + mainTitle 
					+ " - " + jQuery(clipHeader).text() + ".srt";
			var subs = []
			jQuery(p)
			.find("span")
			.each(function(iii,subSpan){
				var subLink = jQuery(subSpan).children("a");
				var time = getQueryParam("start", subLink.get(0).href);
				var subsText = subLink.text();
				subs.push({displayTimeOffset: time, text: subsText});
			});
			var content = subtitleAsSRT(subs);
			//console.info(content);
			saveFile(content, filename);  
		});
	});
}