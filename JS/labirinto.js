(function () {
	//elemento canvas e contexto de renderização
	var cnv = document.querySelector("canvas");
	var ctx = cnv.getContext("2d");

	var HEIGHT = cnv.height, WIDTH = cnv.width;
	var esquerda = 37, cima = 38, direita = 39, baixo = 40;
	var moveEsquerda = moveCima = moveDireita = moveBaixo = false;
	var tileSize = 25;
	var paredes = [];

	var player = {
		x: tileSize + 2,
		y: tileSize + 2,
		width: 18,
		height: 18,
		speed: 2
	};


	//mapa do labirinto
	var maze = [
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
		[1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
		[1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
		[1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
		[1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		[1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		[1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	];

	//preenche as paredes
	for (var row in maze) {
		for (var column in maze[row]) {
			var tile = maze[row][column];
			//identificação e criação da parede
			if (tile === 1) {
				var parede = {
					x: tileSize * column,
					y: tileSize * row,
					width: tileSize,
					height: tileSize
				};
				paredes.push(parede);
			}
		}
	}

	//colisões e bloqueio
	function bloqueiaPlayer(a, b) {
		var distanciaX = (a.x + a.width / 2) - (b.x + b.width / 2);
		var distanciaY = (a.y + a.height / 2) - (b.y + b.height / 2);

		var sumWidth = (a.width + b.width) / 2;
		var sumHeight = (a.height + b.height) / 2;

		if (Math.abs(distanciaX) < sumWidth && Math.abs(distanciaY) < sumHeight) {
			var overlapX = sumWidth - Math.abs(distanciaX);
			var overlapY = sumHeight - Math.abs(distanciaY);

			if (overlapX > overlapY) {
				a.y = distanciaY > 0 ? a.y + overlapY : a.y - overlapY;
			} else {
				a.x = distanciaX > 0 ? a.x + overlapX : a.x - overlapX;
			}
		}
	}

	//setas
	window.addEventListener("keydown", keydownHandler, false);
	window.addEventListener("keyup", keyupHandler, false);


	function keydownHandler(e) {
		var key = e.keyCode;
		switch (key) {
			case esquerda:
				moveEsquerda = true;
				break;
			case direita:
				moveDireita = true;
				break;
			case cima:
				moveCima = true;
				break;
			case baixo:
				moveBaixo = true;
				break;
		}
	}

	function keyupHandler(e) {
		var key = e.keyCode;
		switch (key) {
			case esquerda:
				moveEsquerda = false;
				break;
			case direita:
				moveDireita = false;
				break;
			case cima:
				moveCima = false;
				break;
			case baixo:
				moveBaixo = false;
				break;
		}
	}


	function update() {
		if (moveEsquerda && !moveDireita) {
			player.x -= player.speed;
		} else
			if (moveDireita && !moveEsquerda) {
				player.x += player.speed;
			}
		if (moveCima && !moveBaixo) {
			player.y -= player.speed;
		} else
			if (moveBaixo && !moveCima) {
				player.y += player.speed;
			}
		for (var i in paredes) {
			var parede = paredes[i];
			bloqueiaPlayer(player, parede);
		}
	}

	//renderização (desenha na tela)
	function render() {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		ctx.save();
		for (var row in maze) {
			for (var column in maze) {
				var tile = maze[row][column];
				if (tile === 1) {
					var x = column * tileSize;
					var y = row * tileSize;
					ctx.fillRect(x, y, tileSize, tileSize);
				}
			}
		}
		ctx.fillStyle = "purple";
		ctx.fillRect(player.x, player.y, player.width, player.height);

		ctx.restore();
	}

	function loop() {
		update();
		render();
		chegada();
		requestAnimationFrame(loop, cnv);
	}

	requestAnimationFrame(loop, cnv);
}());







