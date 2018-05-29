// ツイートボタン設置の前準備
// https://dev.twitter.com/web/javascript/loading (真下のコード)
// https://dev.twitter.com/web/tweet-button/parameters (パラメーター参考)
// https://dev.twitter.com/web/tweet-button/javascript-create
window.twttr = (function(d, s, id){
	let js, fjs = d.getElementsByTagName(s)[0], t = window.twttr || {};
	if (d.getElementById(id)) return t;
	js = d.createElement(s);
	js.id = id;
	js.src = 'https://platform.twitter.com/widgets.js';
	fjs.parentNode.insertBefore(js, fjs);

	t._e = [];
	t.ready = function(f) {
		t._e.push(f);
	};

	return t;
}(document, 'script', 'twitter-wjs'));
