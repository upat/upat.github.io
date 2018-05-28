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

// 年齢の初期値を設定
const default_age = 17;

// 西暦の開始と終了を設定
const start_cera = 0;
try{
	// コード実行時の日時を取得
	var now_date = new Date();
}catch(e){
	// 取得できなかった場合は2018年1月1日をセット
	console.log(e);
	console.log('info : set goal_cera 2018/1/1.');
	var now_date = new Date(2018, 0, 1);
}
const goal_cera = now_date.getFullYear();

// 月の上限値
const month = 12;

// 名前の最大文字数
const max_str = 10;

// body要素をバインド
const d3_html = d3.select('body');

// 名前用テキストボックスの設置
d3_html.append('input')
	.attrs({
		type     : 'text',
		size     : max_str*2,       // テキストボックスの幅
		onChange : 'str_counter()', // 入力文字数を制限
		id       : 'name_txt',
		title    : '最大10文字まで',
		value    : '私'
	});

// テキスト
d3_html.append('span').text('は');

// 誕生年セレクトボックスの設置
d3_html.append('select')
	.attrs({
		id       : 'age_year_box'
	});
// 誕生年セレクトボックスの中身
let age_box_loop = 0;
for(age_box_loop = goal_cera;age_box_loop>=start_cera;age_box_loop--){
	if(age_box_loop == goal_cera - default_age){
		d3.select('#age_year_box')
			.append('option')
			.attrs({
				value : age_box_loop,
				selected : '' // goal_cera - default_ageを初期値に
			})
			.text(age_box_loop);
	}else{
		d3.select('#age_year_box')
			.append('option')
			.attr('value', age_box_loop)
			.text(age_box_loop);
	}
}
	
// テキスト
d3_html.append('span').text('年');

// 誕生月セレクトボックスの設置
d3_html.append('select')
	.attrs({
		id       : 'age_month_box'
	});
// 誕生月セレクトボックスの中身
age_box_loop = 0; // 2回目
for(age_box_loop = 0;age_box_loop<month;age_box_loop++){
	d3.select('#age_month_box')
		.append('option')
		.attr('value', age_box_loop)
		.text(age_box_loop+1);
}
	
// テキスト
d3_html.append('span').text('月生まれの、');

// 改行
d3_html.append('br');

// テキスト
d3_html.append('span').style('margin-left', '10px').text('満');

// 年齢テキストボックスの設置
d3_html.append('input')
	.attrs({
		type     : 'text',
		size     : max_str/2,       // テキストボックスの幅
		oninput  : 'reject_char()',
		title    : '0～4桁の半角数字',
		id       : 'age_txt',
		value    : default_age
	});

// テキスト
d3_html.append('span').text('歳です。');

// 改行
d3_html.append('br');

// ボタン設置
d3_html.append('input')
	.attrs({
		type    : 'button',
		value   : '計算',
		onclick : 'age_calculation()'
	});

// メイン処理
function age_calculation(){
	// テキスト出力領域のクリア
	d3.select('#result_txt').remove();
		
	// 名前の取得(無い場合はデフォルト値を入れる)
	const name = document.getElementById('name_txt');
	if(!name.value){ name.value = '私'; }
	// 誕生年の取得(無い場合はデフォルト値を入れる)
	const year = document.getElementById('age_year_box');
	if(!year.value){ year.value = 2001; }
	// 誕生月の取得(無い場合はデフォルト値を入れる)
	const month = document.getElementById('age_month_box');
	if(!month.value){ month.value = 1; }
	// 年齢の取得(無い場合はデフォルト値を入れる)
	const age = document.getElementById('age_txt');
	if(!age.value){ age.value = 17; }
	
	// 入力値を入れる
	const input_date = new Date(year.value, month.value, 1);
	
	console.log(input_date.getMonth() + ', ' + now_date.getMonth());
	console.log();
	console.log(now_date.getMonth() - input_date.getMonth());
	
	// 実年齢の計算
	const diff_year = now_date.getFullYear() - year.value;
	// 出力テキスト
	let result_txt;
	
	if(diff_year == age.value){
		result_txt = name.value + 'は正直者です。';
	}else if(diff_year > age.value){
		result_txt = name.value + 'は満' + age.value + '歳' + (diff_year-age.value)*12 + 'ヶ月です。';
	}else{
		result_txt = name.value + 'は' + (age.value-diff_year) + '年後からやってきた。○ル・○サイ・コン○ルゥ';
	}
	
	// テキスト出力領域の設置
	d3_html.append('div').attr('id', 'result_txt');
	// テキスト出力	
	d3.select('#result_txt').append('p').text(result_txt);
	
	// ツイートボタンの設置(火狐では初期設定で弾かれるので例外処理有)
	d3.select('#result_txt').append('div').attr('id', 'tweet_button');
	try{
		twttr.widgets.createShareButton(
			'https://upat.github.io/age_cal.html',  // URL(非表示の場合は空白スペースを入れること)
			document.getElementById('tweet_button'),
			{
				size     : 'large',    // ツイートボタンの大きさ
				text     : result_txt,  // ツイート本文
				hashtags : '年齢詐称じぇねれーた'
			}
		);
	}catch(e){
		console.log(e);
	}	
}

// 年齢テキストボックスの監視、常に半角数字以外を除去
function reject_char(){
	// 年齢テキストボックスの要素
	const input_str = document.getElementById('age_txt');
	
	// 半角数字以外を排除・配列化->文字列へ戻す
	// ->数字化(先頭が0の時に省く)->文字列(String.lengthで桁数を得るため)
	let num = String(input_str.value).match(/\d/g) || [];
	num = str_comb(num, num.length);
	num = Number(num);
	num = String(num);
	
	console.log(num.length);
	input_str.value = num.length > 4 ? num.slice(0,4) : num; // 5桁以上の時、4桁まで削る
}

// input要素へ入力された文字に対してサロゲートペアを考慮した文字数カウントを行い、トリミングする
function str_counter(){
	const input_str = document.getElementById('name_txt');
	const str_array = Arrayfrom(input_str.value);
	const str_len = str_array.length;

	// 文字数がmax_strより大きい場合はトリミング
	if(str_len > max_str){
		console.log('warning: string too long.');
		input_str.value = str_comb(str_array.slice(0, max_str), max_str);
	}
}

// サロゲートペアを考慮した文字列->文字配列変換. Array.from()より5倍早い.
// ○ぁっきんIE ( https://qiita.com/YusukeHirao/items/2f0fb8d5bbb981101be0 )
function Arrayfrom(str){
	// 0xD800から0xDBFF、0xDC00～0xDFFF、半角スペース・タブ・改行のどれか1文字、
	// 半角スペース・タブ・改行以外の1文字を文字列全体から検索する.
	// 文字列がnull(空文字)の場合は空の配列を返す.
	return str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]|^$/g) || [];
}

// 文字配列の結合. join()より2～3倍早い.
function str_comb(str, length){
	let output_str = '', i;
	
	for(i=0;i<length;i++){
		output_str += str[i];
	}
	
	return output_str;
}

