// ページが読み込まれた時の処理
window.addEventListener("load", () => {
	// 値の読み込み
	var vocal = JSON.parse(localStorage.getItem('vocal')),
		dance = JSON.parse(localStorage.getItem('dance')),
		visual = JSON.parse(localStorage.getItem('visual'));

	// 非数なら
	if (isNaN(vocal) || vocal == null) vocal = 0;
	if (isNaN(dance) || dance == null) dance = 0;
	if (isNaN(visual) || visual == null) visual = 0;

	// 書き込み
	document.getElementById('vocal').value = vocal;
	document.getElementById('dance').value = dance;
	document.getElementById('visual').value = visual;

	calc();
});

// 計算・表示
var calc = function () {
	// ステータス最大値
	var Max = 1800,
		// 各評価ランクのボーダー
		ss = 16000,
		s_plus = 14500,
		s = 13000,
		a_plus = 11500,
		a = 10000,
		b_plus = 8000,
		b = 6000 - 1700,
		c_plus = 4500,
		c = 3000,
		// 評価ランクスコア
		rank = [ss, s_plus, s, a_plus, a, b_plus, b, c_plus, c],
		// 評価ランク名
		rankName = ['ss', 's_plus', 's', 'a_plus', 'a', 'b_plus', 'b', 'c_plus', 'c'],
		// 各ステータス値
		vocal = document.getElementById('vocal').value,
		dance = document.getElementById('dance').value,
		visual = document.getElementById('visual').value;

	// 空欄なら
	if (vocal == '') vocal = 0;
	if (dance == '') dance = 0;
	if (visual == '') visual = 0;

	// 現在の評価点(ステータスと順位,最終試験後の+30込み)
	var nowScore = parseInt(((
		Math.min(parseInt(vocal) + 30, Max)
		+ Math.min(parseInt(dance) + 30, Max)
		+ Math.min(parseInt(visual) + 30, Max)) * 23) / 10) + 1700;

	// ボーダーから現在の評価点を減算
	for (var i = 0; i < rank.length; i++) {
		rank[i] -= nowScore;
	}

	// 出力
	for (var i = 0; i < rank.length && i < rankName.length; i++) {
		document.getElementById('score_' + rankName[i]).innerHTML = Math.max(calcFinalExamScore(rank[i]), 0);
	}

	// 値を保存
	jsonVocal = JSON.stringify(vocal);
	jsonDance = JSON.stringify(dance);
	jsonVisual = JSON.stringify(visual);
	localStorage.setItem('vocal', jsonVocal);
	localStorage.setItem('dance', jsonDance);
	localStorage.setItem('visual', jsonVisual);
}

// 評価点を渡すと、その評価点を得るために必要な最終試験のスコアの最低値を返す
var calcFinalExamScore = function (needScore) {
	if (needScore <= 0) return 0;

	if (needScore <= 1500)
		return Math.ceil(needScore / 0.3);
	else if (needScore <= 2250)
		return 5000 + Math.ceil((needScore - 1500) / 0.15);
	else if (needScore <= 3050)
		return 10000 + Math.ceil((needScore - 2250) / 0.08);
	else if (needScore <= 3450)
		return 20000 + Math.ceil((needScore - 3050) / 0.04);
	else if (needScore <= 3650)
		return 30000 + Math.ceil((needScore - 3450) / 0.02);
	else
		return 40000 + Math.ceil((needScore - 3650) / 0.01);
}
