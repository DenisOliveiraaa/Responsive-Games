var playerScore = 0
var iaScore = 0


function play(player) {
    switch (player) {
        case 0:
            handleClickAnimation('pedra')
            break;
        case 1:
            handleClickAnimation('papel')
            break;
        case 2:
            handleClickAnimation('tesoura')
            break;
    }
    var ia = Math.floor(Math.random() * 3)

    var ganhador = ""

    if ((ia == 0 && player == 2) || (ia == 1 && player == 0) || (ia == 2 && player == 1)) {
        ganhador = "IA"
        iaScore++
    }
    else if (ia == player) {
        ganhador = "Ninguem"
    } else {
        ganhador = "Player"
        playerScore++
    }

    var p1 = document.getElementById("winner")
    p1.innerHTML = ganhador + " ganhou!"

    var p2 = document.getElementById("score")
    p2.innerHTML = playerScore + "X" + iaScore
}

function handleClickAnimation(id) {
    var elem = document.getElementById(id)
    elem.classList.add('clicker')
    setTimeout(() => {
        elem.className = 'img-div'
    }, 1000)
}