// ツイートボタン設置の前準備
// https://dev.twitter.com/web/javascript/loading (真下のコード)
// https://dev.twitter.com/web/tweet-button/parameters (パラメーター参考)
// https://dev.twitter.com/web/tweet-button/javascript-create
window.twttr = (function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0], t = window.twttr || {};
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

// 文字テンプレート
var str_template1 = 'なぎうなぎ';
var str_template2 = 'ぷぇっぷぇ';

// テキスト表示領域の幅
var text_width = 700;

// カウントする文字の最大数
var max_counter = 2000;

// 表示した文字のカウンタ兼多重処理防止変数
var counter = 0;

// d3.jsでbody要素のバインド
d3_html = d3.select('body');

// テキスト
d3_html.append('p').text('3～5文字,4000字まで対応. 絵文字とか変な文字でも大丈夫…なはず.');

// テキストボックスの設置
d3_html.append('input')
	.attrs({
		type      : 'text',
		size      : '8',  // テキストボックスの幅
		maxlength : '12', // 入力可能な文字数
		id        : 'text_box'
	});

// 空白スペース
d3_html.append('span').text(' ');

// 汎用ボタン設置
d3_html.append('input')
	.attrs({
		type    : 'button',
		value   : 'ポプる',
		onclick : 'text_box_onbuttonclick();'
	});

// 空白スペース
d3_html.append('span').text(' ');

// カウンタの設置
d3_html.append('span').attr('id', 'counter').text(counter + ' 回');

// カウンタのID取得
counter_text = document.getElementById('counter');

// 改行
d3_html.append('p');

// なぎるボタン設置
d3_html.append('input')
	.attrs({
		type    : 'button',
		value   : 'なぎる',
		onclick : 'pueeeee(str_template1);'
	});

// 空白スペース
d3_html.append('span').text(' ');

// ぷぇるボタン設置
d3_html.append('input')
	.attrs({
		type    : 'button',
		value   : 'ぷぇる',
		onclick : 'pueeeee(str_template2);'
	});

// テキスト表示領域の確保
txt = d3_html.append('div').attr('width', text_width + 'px');

// 乱数生成 ( https://lab.syncer.jp/Web/JavaScript/Snippet/15/ )
function create_random_num(max){
	var min = 0; // 乱数の最小値(配列の添字に使うので0固定)
	
	return  Math.floor(Math.random() * (max + 1 - min)) + min;
}

// 半角・全角スペースの可視化
function check_space(str){
	if(str == ' ' || str == '　'){
		return '[ ]';
	}else{
		return str;
	}
}

// 画面スクロールに使用
function page_scroll(position){
	$('html, body').animate({scrollTop:position});
}

// 汎用ボタンが押された場合の処理
function text_box_onbuttonclick(){
	// テキストボックス読み取り
	var input_str = document.getElementById('text_box').value;
	var input_str_array = Array.from(input_str);
	
	// 文字数が短すぎる場合は終了
	if(input_str_array.length < 3){
		console.log('error: string too short.');
		return;
	}

	// 文字数が長すぎる場合はトリミング
	if(input_str_array.length > 5){
		console.log('warning: string too long.');
		input_str = input_str.slice(0, 5);
	}
	
	pueeeee(input_str);
}

// テンプレートと一致するまでテンプレートからランダムに1文字ずつ画面出力を行う関数
function pueeeee(template){
	// ボタン連打防止
	if(counter != 0){
		return;
	}
	
	// templateの配列化
	var template_array = Array.from(template);    // Array.from()はサロゲートペア対応の配列変換
	if(template_array.length != template.length){ // サロゲートペアを含んだ場合
		console.log('warning: input surrogate pair.');
	}
	
	// 終了条件に使用する配列
	var compare_str = [];

	// p要素(テキスト領域)、ツイートボタンが既に存在する場合のクリア
	d3.select('#text_data').remove();

	// 空のp要素(テキスト領域)の再生成
	txt.append('p')
		.attrs({
			id : 'text_data'
		})
		.styles({
			'word-wrap' : 'break-word',
			'width'     : text_width + 'px'
		});
	
	/*
	 *  setIntervalで処理に遅延をかけながらtemplate_arrayからランダムに吐き出した文字をcompare_strへArray.prototype.push()
	 *  compare_strの文字数がtemplate_arrayと同じ数になったらArray.prototype.shift()で先頭を削りながら無限ループ
	 *  compare_strがtemplateと一致したらclearIntervalでループ終了
	 */
	var exe = setInterval(function(){
		if(compare_str.length < template_array.length){
			compare_str.push(template_array[create_random_num(template_array.length-1)]);
		}else{
			compare_str.shift();
			compare_str.push(template_array[create_random_num(template_array.length-1)]);
		}
		var temp = document.getElementById('text_data');
		temp.textContent = temp.textContent + check_space(compare_str.slice(-1)); // 半角・全角スペースの可視化
		counter++;
		
		// カウンタのテキストを更新
		counter_text.textContent = counter + ' 回';
		
		// 異常終了のパターン(一応動作してる)
		if(compare_str.length > template_array.length || counter >= max_counter){
			d3.select('#text_data').append('p')
				.text('ぷエラー counter : ' + counter + ', length : ' + compare_str.length + ', ' + template_array.length);
			counter = 0;        // カウンタ初期化(ボタンの有効化)
			clearInterval(exe); // ループ停止
		}
		
		// 正常に終わるパターン	
		if(compare_str.join('') == template){
			var tweet_text = counter + '回 『' + template + '』しました。ぷぇーっ！';
			d3.select('#text_data').append('p').text(tweet_text);
			d3.select('#text_data').append('div').attr('id', 'tweet_button');
			
			// ツイートボタンの設置(火狐では初期設定で弾かれるので例外処理有)
			try{
				twttr.widgets.createShareButton(
					'https://upat.github.io/%E3%81%B5%E3%81%87%E3%81%87%E3%82%8F%E3%81%A1%E3%82%83%E3%82%82%E3%81%A1%E3%82%83%E3%81%BA%E3%81%A3%E3%81%9F%E3%82%93.com.html', // URL(ブラウザによっては空欄でも強制挿入)
					document.getElementById('tweet_button'),
					{
						size     : 'large',    // ツイートボタンの大きさ
						text     : tweet_text, // ツイート本文
						hashtags : 'ぷぇぷぇ'  // ハッシュタグ
					}
				);
			}catch(e){
				console.log(e);
			}
			
			// 画面に表示されている縦幅とコンテンツの縦幅の比較
			if(document.documentElement.clientHeight < document.body.clientHeight){
				// 空白スペース
				d3.select('#text_data').append('span').text(' ');
				
				// 画面上部へ戻るボタンの設置
				d3.select('#text_data')
					.append('input')
					.attrs({
						type    : 'button',
						value   : 'わんもあ！',
						onclick : 'page_scroll(0);'
					});
			}
			
			// 画面最下部へスクロールするための目印
			d3.select('#text_data').append('p').attr('id', 'p_footer');
			
			// 終了後に画面下へスクロール
			page_scroll($('#p_footer').offset().top);
			
			counter = 0;        // カウンタ初期化(ボタンの有効化)
			clearInterval(exe); // ループ停止
		}
	}, 5); // 5ms遅延
}
