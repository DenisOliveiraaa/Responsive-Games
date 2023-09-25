/* Seleciona todos os elementos com a classe 'memory-card' e os armazena em uma lista*/
const cards = document.querySelectorAll('.memory-card');

/* Variáveis para rastrear o estado do jogo*/
let hasFlippedCard = false; /* Indica se uma carta já foi virada*/
let lockBoard = false; /* Bloqueia o tabuleiro enquanto as cartas são comparadas*/
let firstCard, secondCard; /* Armazena as duas cartas viradas para verificação*/
let playerName = prompt("Digite seu nome: ");

/* Esta função vira uma carta quando clicada*/
function flipCard() {
  if (lockBoard) return; /* Retorna se o tabuleiro está bloqueado*/
  if (this === firstCard) return; /* Retorna se a mesma carta é clicada duas vezes*/

  this.classList.add('flip'); /* Adiciona a classe 'flip' para mostrar a carta*/

  if (!hasFlippedCard) {
    /* Primeiro clique - armazena a primeira carta e aguarda a segunda*/
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  /* Segundo clique - armazena a segunda carta e verifica se há correspondência*/
  secondCard = this;
  checkForMatch();
}

/* Esta função verifica se as duas cartas viradas são iguais*/
function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

/* Esta função desativa as cartas correspondentes*/
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
  checkIfAllCardsMatched(); // Verifica se todas as cartas foram correspondidas.
}

/* Esta função desvira as cartas quando não há correspondência*/
function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500); /* Tempo para mostrar as cartas antes de desvirá-las*/
}

/* Esta função reseta o estado do jogo*/
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

/* Esta função embaralha as cartas no início do jogo*/
(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

/* Adiciona um ouvinte de evento de clique a cada carta para virá-la */
cards.forEach(card => card.addEventListener('click', flipCard));

//isso aqui nao deu muito certo, lá em baixo deu
/* Esta função verifica se todas as cartas foram correspondidas */
/***function checkIfAllCardsMatched() {
  const allCards = Array.from(cards);
  const matchedCards = allCards.filter(card => card.classList.contains('disable'));

  if (matchedCards.length === allCards.length) {
    setTimeout(() => {
      alert('Parabéns! Você ganhou o jogo!');
      restartGame(); // Reinicia o jogo após a vitória.
    }, 1000);
  }
}*/

/* Função para reiniciar o jogo */
function restartGame() {
  // Reabilita todas as cartas para que o jogo possa ser reiniciado
  cards.forEach(card => {
    card.classList.remove('disable');
    card.addEventListener('click', flipCard);
  });

  // Embaralha as cartas novamente
  (function shuffle() {
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * 12);
      card.style.order = randomPos;
    });
  })();

  // Remove a classe 'flip' de todas as cartas
  cards.forEach(card => card.classList.remove('flip'));

  // Desbloqueia o tabuleiro
  lockBoard = false;
}

/* Esta função verifica se todas as cartas foram correspondidas e recarrega a página, se necessário. */
function checkIfAllCardsMatched() {
  const allCards = Array.from(cards);
  const matchedCards = allCards.filter(card => card.classList.contains('disable'));

  if (matchedCards.length === allCards.length) {
    setTimeout(() => {
      alert(`Parabéns ${playerName}! Você ganhou o jogo!`);
      location.reload(); /* Recarrega a página quando todas as cartas forem correspondidas*/
    }, 1000);
  }
}

/* Esta função desativa as cartas correspondentes. */
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  firstCard.classList.add('disable');
  secondCard.classList.add('disable');

  resetBoard();
  checkIfAllCardsMatched(); /* Verifica se todas as cartas foram correspondidas*/
}


/* Inicie o jogo*/
restartGame();
