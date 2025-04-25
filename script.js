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

// Seleciona o texto de resultado e o botão de replay
let textResult = document.querySelector(`#txtResult`)
let replay = document.querySelector(`#replay`)

//Muda Tela para o tabuleiro
window.onload = () => {
  //Vai definir quem começa de acordo com o "icon" selecionado
  selecionaLobo.onclick = () => {
    inicio.classList.add('hide')
    meio.classList.remove('hide')
    jogadorLobo.setAttribute('id', 'selecionado') // Define o id "selecionado" para o Lobo
    jogadorCordeiro.removeAttribute('id') // Remove o id do Cordeiro, caso exista
    // Aqui você pode adicionar mais lógica para iniciar o jogo com o Lobo
  }
  selecionaCordeiro.onclick = () => {
    inicio.classList.add('hide')
    meio.classList.remove('hide')
    jogadorCordeiro.setAttribute('id', 'selecionado') // Define o id "selecionado" para o Cordeiro
    jogadorLobo.removeAttribute('id') // Remove o id do Lobo, caso exista
    // Aqui você pode adicionar mais lógica para iniciar o jogo com o Cordeiro
  }
}

// Da F5 na pag
replay.onclick = () => {
  window.location.reload()
}
