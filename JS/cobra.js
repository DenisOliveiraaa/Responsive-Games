const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const size = 30;
let snake = [{ x: 0, y: 0 }]; 

const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

const gerarnumero = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const gerarposicao = () => {
  const numero = gerarnumero(0, canvas.width - size);
  return Math.round(numero / 30) * 30;
};

const comida = {
  x: gerarposicao(),
  y: gerarposicao(),
  color: "red",
};

let direcao, loopId;

const desencomida = () => {
  const { x, y, color } = comida;

  ctx.shadowColor = color;
  ctx.shadowBlur = 5;
  ctx.fillStyle = comida.color;
  ctx.fillRect(comida.x, comida.y, size, size);
  ctx.shadowBlur = 0;
};

const desencobrinha = () => {
  ctx.fillStyle = "#ddd";

  snake.forEach((posicao) => {
    ctx.fillRect(posicao.x, posicao.y, size, size);
  });
};

const movercobrinha = () => {
  if (!direcao) return;

  const cabeca = snake[snake.length - 1];

  if (direcao == "right") {
    snake.push({ x: cabeca.x + size, y: cabeca.y });
  }
  if (direcao == "left") {
    snake.push({ x: cabeca.x - size, y: cabeca.y });
  }
  if (direcao == "down") {
    snake.push({ x: cabeca.x, y: cabeca.y + size });
  }
  if (direcao == "up") {
    snake.push({ x: cabeca.x, y: cabeca.y - size });
  }

  snake.shift();
};

const desengrade = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#56baed";

  for (let i = 30; i < canvas.width; i += size) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};

const verificarcomida = () => {
  const cabeca = snake[snake.length - 1];

  if (cabeca.x == comida.x && cabeca.y == comida.y) {
    incrementScore();
    snake.push(cabeca);

    let x = gerarposicao();
    let y = gerarposicao();

    while (snake.find((posicao) => posicao.x == x && posicao.y == y)) {
      x = gerarposicao();
      y = gerarposicao();
    }
    comida.x = x;
    comida.y = y;
  }
};

const verificarcolisao = () => {
  const cabeca = snake[snake.length - 1];
  const canvaslimite = canvas.width - size;
  const pescoco = snake.length - 2;

  const colisaoparede =
    cabeca.x < 0 ||
    cabeca.x > canvaslimite ||
    cabeca.y < 0 ||
    cabeca.y > canvaslimite;

  const colisaocobrinha = snake.find((posicao, index) => {
    return index < pescoco && posicao.x == cabeca.x && posicao.y == cabeca.y;
  });

  if (colisaoparede || colisaocobrinha) {
    fimdejogo();
  }
};

const fimdejogo = () => {
  direcao = undefined;

  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
};

const loopjogo = () => {
  clearInterval(loopId);

  ctx.clearRect(0, 0, 600, 600);
  desengrade();
  desencomida();
  movercobrinha();
  desencobrinha();
  verificarcomida();
  verificarcolisao();

  loopId = setTimeout(() => {
    loopjogo();
  }, 150);
};

loopjogo();

document.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowRight" && direcao != "left") {
    direcao = "right";
  }
  if (key == "ArrowLeft" && direcao != "right") {
    direcao = "left";
  }
  if (key == "ArrowDown" && direcao != "up") {
    direcao = "down";
  }
  if (key == "ArrowUp" && direcao != "down") {
    direcao = "up";
  }
});

buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";


  snake = [{ x: 0, y: 0 }];


  loopjogo();
});
