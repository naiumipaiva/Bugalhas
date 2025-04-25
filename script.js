//Seleção de Elementos do HTML

// Seleciona as principais telas do jogo, o inicio, meio e fim
let inicio = document.querySelector(`#home`)
let meio = document.querySelector(`main`)
let fim = document.querySelector(`#fim`)

// Seleciona os id´s dos players para saber qual começa
let selecionaLobo = document.querySelector(`#lobo`)
let selecionaCordeiro = document.querySelector(`#cordeiro`)

// Seleciona a vez dos jogadores
let jogadorLobo = document.querySelector(`.playerLobo`)
let jogadorCordeiro = document.querySelector(`.playerCordeiro`)

// Seleciona as celulas do tabuleiro
let cell = document.querySelectorAll(`.cell`)

// Seleciona a img da div dado de cada jogador
let imgDadoCordeiro = document.querySelector('#imagemDadoCordeiro')
let imgDadoLobo = document.querySelector('#imagemDadoLobo')

// Seleciona o texto de resultado e o botão de replay
let textResult = document.querySelector(`#txtResult`)
let replay = document.querySelector(`#replay`)

//Muda Tela para o tabuleiro
window.onload = () => {
  //Vai definir quem começa de acordo com o botão
  selecionaLobo.onclick = () => {
    inicio.classList.add('hide')
    meio.classList.remove('hide')
    jogadorLobo.setAttribute('id', 'selecionado') // Define o id "selecionado" para o Lobo
    jogadorCordeiro.removeAttribute('id') // Remove o id do Cordeiro, caso exista
    iniciarTurno()
  }
  selecionaCordeiro.onclick = () => {
    inicio.classList.add('hide')
    meio.classList.remove('hide')
    jogadorCordeiro.setAttribute('id', 'selecionado') // Define o id "selecionado" para o Cordeiro
    jogadorLobo.removeAttribute('id') // Remove o id do Lobo, caso exista
    iniciarTurno()
  }
}

//1- Inicio do turno

function iniciarTurno() {
  let valorDado = sortearDado()
  mostrarDado(valorDado)
}

function sortearDado() {
  return Math.floor(Math.random() * 6) + 1
}

function mostrarDado(n) {
  let jogadorAtual = document.querySelector(`#selecionado`)

  imgDadoCordeiro.style.display = 'none'
  imgDadoLobo.style.display = 'none'

  if (!jogadorAtual) return

  if (jogadorAtual.classList.contains(`playerCordeiro`)) {
    imgDadoCordeiro.src = `dados/${n}.png`
    imgDadoCordeiro.alt = `Dado de número ${n}`
    imgDadoCordeiro.style.display = 'block'
  } else if (jogadorAtual.classList.contains(`playerLobo`)) {
    imgDadoLobo.src = `dados/${n}.png`
    imgDadoLobo.alt = `Dado de número ${n}`
    imgDadoLobo.style.display = 'block'
  }
}

//2- Jogador escolhe a coluna

function clicaNaColuna() {
    if (condition) {
        
    } else {
        
    }
    
}

// Da F5 na pag
replay.onclick = () => {
  window.location.reload()
}
