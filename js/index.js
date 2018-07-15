var game = new newGame();
game.initGame();
//初始化
function newGame() {
	this.isSmallDevice = window.screen.availWidth < 640 ? true : false;
	this.container = document.getElementById('cell-container');
	this.eleScore = document.getElementById('score-num');
	this.score = 0;
	this.panelArr = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];
	this.colorArr = [
		['#eee4da', '#776e66'],
		['#ede0c8', '#776e66'],
		['#f2b179', '#fff'],
		['#f59563', '#fff'],
		['#f67c5f', '#fff'],
		['#f65e3b', '#fff'],
		['#edcf72', '#fff'],
		['#d9f306', '#fff'],
		['#ed4c61', '#fff'],
		['#cb58e8', '#fff'],
		['##f9e601', '#fff'],
		['#ed2e48', '#fff']
	]

	this.initGame = function () {
		this.randomOneNumber();
		this.randomOneNumber();
	}

	this.resetGame = function () {
		this.panelArr = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				this.clearOneCell(i, j);
			}
		}
		this.score = 0;
		this.eleScore.innerText = this.score;
		this.initGame();
	}

	//生成2并显示出来
	this.randomOneNumber = function () {
		//随机选取格子
		var panelX = parseInt(Math.floor(Math.random() * 4));
		var panelY = parseInt(Math.floor(Math.random() * 4));
		//判断选取的格子是否为空，如果不为空则循环再选，直到选到空格子或者times达到50
		var times = 0;
		while (this.panelArr[panelX][panelY]) {
			panelX = parseInt(Math.floor(Math.random() * 4));
			panelY = parseInt(Math.floor(Math.random() * 4));
			times++;
			//当随机50次后还未选到空格子，就遍历选取第一个空格子
			if (times >= 50 && this.panelArr[panelX][panelY]) {
				for (var i = 0; i < 4; i++) {
					for (var j = 0; j < 4; j++) {
						if (this.panelArr[i][j] == 0) {
							panelX = i;
							panelY = j;
							break;
						}
					}
					if(!this.panelArr[panelX][panelY]){
						break;
					}
				}
			}
		}
		//将数字显示到对应的空格子中
		this.showNumCell(panelX, panelY, 2, true);
		this.panelArr[panelX][panelY] = 2;
		var numCells = document.getElementsByClassName('number-cell');
		if(numCells.length >= 16){
			var isContinue = 0;
			isContinue += Number(this.moveCell(1,true));
			isContinue += Number(this.moveCell(2,true));
			isContinue += Number(this.moveCell(3,true));
			isContinue += Number(this.moveCell(4,true));
			if(!isContinue){
				var that = this;
				setTimeout(function(){
					if (confirm("Game Over! Do you want to try again?")) {
						that.resetGame();
					}
				},1000)
			}
		}
	}

	//显示随机出现的数字2/4，并更新this.panelArr数组
	this.showNumCell = function (panelX, panelY, showNumber, isNew, isMerge) {
		var eleNumCell = document.createElement('div');
		if (isNew) {
			eleNumCell.setAttribute('class', 'number-cell new-cell');
		} else if(isMerge){
			eleNumCell.setAttribute('class', 'number-cell merge-cell');
		}else{
			eleNumCell.setAttribute('class', 'number-cell');
		}
		eleNumCell.setAttribute('id', 'number-cell-' + panelX + '-' + panelY);
		eleNumCell.innerText = showNumber;
		this.setCellPos(eleNumCell, panelX, panelY);
		this.setCellColor(eleNumCell, showNumber);
		this.container.append(eleNumCell);
	}

	//清除某个格子
	this.clearOneCell = function (panelX, panelY) {
		var eleTargetCell = document.getElementById('number-cell-' + panelX + '-' + panelY);
		if (eleTargetCell) {
			this.container.removeChild(eleTargetCell);
		}
	}

	//设置数字格的位置
	this.setCellPos = function (ele, panelX, panelY) {
		if (this.isSmallDevice) {
			ele.style.top = panelX * 60 + 10 + 'px';
			ele.style.left = panelY * 60 + 10 + 'px';
		} else {
			ele.style.top = panelX * 120 + 20 + 'px';
			ele.style.left = panelY * 120 + 20 + 'px';
		}
	}

	//设置数字格的字体颜色和背景色
	this.setCellColor = function (ele, num) {
		var index = Math.log(num) / Math.log(2) - 1;
		ele.style.backgroundColor = this.colorArr[index][0];
		ele.style.color = this.colorArr[index][1];
	}

	//按方向移动格子
	this.moveCell = function (direct,isTest) {
		var beforePanel = JSON.stringify(this.panelArr);
		var mergeArr = [-1,-1,-1,-1];
		//按方向移动，往哪个方向移动数字格就移到哪边去，空白格移到相反的方向
		for (var i = 0; i < 4; i++) {
			var nullArr = []; //存储空白格
			var numArr = []; //存储数字格
			for (var j = 0; j < 4; j++) {
				//根据direct区分方向，决定是按行循环还是按列循环
				var panelNumber = (direct == 1 || direct == 3) ? this.panelArr[i][j] : this.panelArr[j][i];
				if (panelNumber == 0) {
					nullArr.push(panelNumber);
				} else {
					numArr.push(panelNumber);
				}
			}

			var offset = nullArr.length;
			if (direct == 1 || direct == 2) {
				//左移或者上移，正向遍历数组 合并相等的相邻格子
				for (var k = 0; k < numArr.length - 1; k++) {
					if (numArr[k] == 0) {
						break;
					}
					if (numArr[k] == numArr[k + 1]) {
						numArr[k] = numArr[k] * 2;
						numArr.splice(k + 1, 1);
						numArr.push(0);
						this.score += numArr[k];
						direct == 1 ? mergeArr[i] = k : mergeArr[k] = i;
					}
				}
			} else {
				//右移或者下移，反向遍历数组 合并相等的相邻格子
				for (var k = numArr.length - 1; k > 0; k--) {
					if (numArr[k] == 0) {
						break;
					}
					if (numArr[k] == numArr[k - 1]) {
						numArr[k] = numArr[k] * 2;
						numArr.splice(k - 1, 1);
						numArr.unshift(0);
						this.score += numArr[k];
						direct == 3 ? mergeArr[i] = k + offset : mergeArr[k + offset] = i;
					}
				}
			}
			switch (direct) {
				case 1: //左移
					//左移是数字格在左，空白格在右，所以numArr连接nullArr
					this.panelArr[i] = numArr.concat(nullArr);
					break;
				case 2: //上移
					//上移是数字格在上，空白格在下，所以numArr连接nullArr
					var arr = numArr.concat(nullArr);
					for (var m = 0; m < 4; m++) {
						this.panelArr[m][i] = arr[m];
					}
					break;
				case 3: //右移
					//右移是数字格在右，空白格在左，所以nullArr连接numArr
					this.panelArr[i] = nullArr.concat(numArr);
					break;
				default: //下移
					//下移是数字格在下，空白格在上，所以nullArr连接numArr
					var arr = nullArr.concat(numArr);
					for (var m = 0; m < 4; m++) {
						this.panelArr[m][i] = arr[m];
					}
					break;
			}
		}
		if (beforePanel == JSON.stringify(this.panelArr)) {
			return false;
		}
		if(isTest){
			this.panelArr = JSON.parse(beforePanel)
			return true;
		}
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				this.clearOneCell(i, j);
				if (this.panelArr[i][j]) {
					if (j == mergeArr[i]){
						this.showNumCell(i, j, this.panelArr[i][j],false,true);
					}else{
						this.showNumCell(i, j, this.panelArr[i][j]);
					}
				}
			}
		}
		this.eleScore.innerText = this.score;
		this.randomOneNumber();
	}
}

//按键响应函数
document.body.onkeydown = function (ev) {
	var ev = ev || event;
	switch (ev.keyCode) {
		case 37:
			game.moveCell(1); //左
			break;
		case 38:
			game.moveCell(2); //上
			break;
		case 39:
			game.moveCell(3); //右
			break;
		case 40:
			game.moveCell(4); //下
			break;
	}
	return false; //阻止事件默认行为
}

//移动端触摸移动
var cellContainer = document.getElementById('cell-container');
var startX = 0,
	startY = 0,
	endX = 0,
	endY = 0;
cellContainer.addEventListener("touchstart", function (event) {
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
});
cellContainer.addEventListener("touchmove", function (event) {
	endX = event.touches[0].pageX;
	endY = event.touches[0].pageY;
	event.preventDefault();
});
cellContainer.addEventListener("touchend", function (event) {
	var disX = endX - startX;
	var disY = endY - startY;
	if (Math.abs(disX) > Math.abs(disY) && disX < 0) { //左
		game.moveCell(1);
	} else if (Math.abs(disX) < Math.abs(disY) && disY < 0) { //上
		game.moveCell(2);
	} else if (Math.abs(disX) > Math.abs(disY) && disX > 0) { //右
		game.moveCell(3);
	} else if (Math.abs(disX) < Math.abs(disY) && disY > 0) { //下
		game.moveCell(4);
	} else { //未滑动
		console.log('未滑动')
	}
});

//重新开始游戏点击事件
var gameBtn = document.getElementById('game-btn');
gameBtn.onclick = function (event) {
	game.resetGame();
}