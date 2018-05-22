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

// 文字テンプレート
const str_template1 = 'なぎうなぎ';
const str_template2 = 'ぷぇっぷぇ';

// 遅延ループで使用する秒数(ms)
const delay_num = 10;

// テキスト表示領域の幅
const text_width = 700;

// カウントする文字、テキスト入力字数の閾値
const max_counter = 5000;
const max_str = 5; // 以上
const min_str = 3; // 以下

// 文字数が3文字以上の時trueになるフラグ
let start_flag = false;

// 表示した文字のカウンタ兼多重処理防止変数
let counter = 0;

// d3.jsでbody要素のバインド
const d3_html = d3.select('body');

// テキスト
d3_html.append('p').style('width', text_width + 'px')
	.text(min_str + '～' + max_str + '文字,' + max_counter + '字まで対応. 絵文字とか変な文字でも大丈夫…なはず.');

// テキストボックスの設置
d3_html.append('input')
	.attrs({
		type     : 'text',
		size     : max_str*2,       // テキストボックスの幅
		onChange : 'str_counter()', // 入力文字数を制限
		id       : 'text_box'
	});

// 空白スペース
d3_html.append('span').text(' ');

// 汎用ボタン設置
d3_html.append('input')
	.attrs({
		type    : 'button',
		value   : 'ポプる',
		onclick : 'text_box_onbuttonclick()'
	});

// 空白スペース
d3_html.append('span').text(' ');

// カウンタの設置
d3_html.append('span').attr('id', 'counter').text(counter + ' 回');

// counter要素の取得
const cnt_txt = document.getElementById('counter');

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
const txt = d3_html.append('div').attr('width', text_width + 'px');

// 乱数生成 ( https://lab.syncer.jp/Web/JavaScript/Snippet/15/ )
function create_random_num(max){
	const min = 0; // 乱数の最小値(配列の添字に使うので0固定)
	
	return  Math.floor(Math.random() * (max + 1 - min)) + min;
}

// サロゲートペアを考慮した文字数カウントを行い、トリミングする
function str_counter(){
	const input_str = document.getElementById('text_box');
	const str_array = Array.from(input_str.value);
	const str_len = str_array.length;
	
	// 文字数がmin_str未満の場合はフラグをfalse
	if(str_len < min_str){
		// console.log('error: string too short.');
		start_flag = false;
	}else{
		start_flag = true;
	}

	// 文字数がmax_strより大きい場合はトリミング
	if(str_len > max_str){
		console.log('warning: string too long.');
		input_str.value = str_comb(str_array.slice(0, max_str), max_str);
	}
}

// 文字配列の結合(joinが遅いので)
function str_comb(str, length){
	let output_str = '', i;
	
	for(i=0;i<length;i++){
		output_str += str[i];
	}
	
	return output_str;
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
	if(start_flag){ // フラグがtrueの時
		pueeeee(document.getElementById('text_box').value);
	}
}

// テンプレートと一致するまでテンプレートからランダムに1文字ずつ画面出力を行う関数
function pueeeee(template){
	// ボタン連打防止
	if(counter != 0){
		return;
	}
	
	// templateの配列化
	const template_array = Array.from(template); // Array.from()はサロゲートペア対応の配列変換
	const tmp_array_len = template_array.length; // 文字数取得
	if(tmp_array_len != template.length){        // サロゲートペアを含んだ場合
		console.log('warning: input surrogate pair.');
	}
	
	// 終了条件に使用する配列・配列の長さ
	let compare_str = [];
	let compstr_len = compare_str.length;

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
	
	// text_data要素の取得
	const txt_data = document.getElementById('text_data');
	const sel_txtdata = d3.select('#text_data');
	
	/*
	 *  setIntervalで処理に遅延をかけながらループ
	 *  template_arrayからランダムに吐き出した文字をcompare_strへArray.prototype.push()
	 *  compare_strの文字数がtemplate_arrayと同じ数になったらArray.prototype.shift()で先頭を削りながら無限ループ
	 *  compare_strがtemplateと一致したらclearIntervalでループ終了
	 */
	let exe = setInterval(function(){
		// 長さが一致または長い時は先頭を削る(後者の場合エラーで先に落ちてそう)
		if(compstr_len >= tmp_array_len){
			compare_str.shift();
		}
		compare_str.push(template_array[create_random_num(tmp_array_len-1)]);         // 配列へpush
		compstr_len = compare_str.length;
		txt_data.insertAdjacentHTML('beforeend', check_space(compare_str.slice(-1))); // 既存の要素内テキストへ追加(上書きではない)
		
		// カウンタの増加・テキストを更新(=上書き)
		cnt_txt.textContent = (++counter) + ' 回';
		
		// 異常終了のパターン(一応動作してる)
		if(compstr_len > tmp_array_len || counter >= max_counter){
			sel_txtdata.append('p')
				.attr('id', 'err_txt')
				.text('ぷエラー counter : ' + counter + ', length : ' + compstr_len + ' ' + tmp_array_len);
			page_scroll($('#err_txt').offset().top);
			
			// 画面上部へ戻るボタンの設置
			sel_txtdata.append('input')
				.attrs({
					type    : 'button',
					value   : '画面上へ',
					onclick : 'page_scroll(0);'
				});
			
			counter = 0;        // カウンタ初期化(ボタンの有効化)
			clearInterval(exe); // ループ停止
		}
		
		// 正常に終わるパターン
		if(str_comb(compare_str, compstr_len) == template){
			const tweet_text = counter + '回 『' + template + '』しました。ぷぇーっ！';
			sel_txtdata.append('p').text(tweet_text);
			sel_txtdata.append('div').attr('id', 'tweet_button');
			
			// ツイートボタンの設置(火狐では初期設定で弾かれるので例外処理有)
			try{
				twttr.widgets.createShareButton(
					'https://bit.ly/2x4dBQM',  // URL(非表示の場合は空白スペースを入れること)
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
				sel_txtdata.append('span').text(' ');
				
				// 画面上部へ戻るボタンの設置
				sel_txtdata.append('input')
					.attrs({
						type    : 'button',
						value   : '画面上へ',
						onclick : 'page_scroll(0);'
					});
			}
			
			// 画面最下部へスクロールするための目印
			sel_txtdata.append('p').attr('id', 'p_footer');
			
			// 終了後に画面下へスクロール
			page_scroll($('#p_footer').offset().top);
			
			counter = 0;        // カウンタ初期化(ボタンの有効化)
			clearInterval(exe); // ループ停止
		}
		
	}, delay_num);
}

